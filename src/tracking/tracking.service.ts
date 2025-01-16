import { DynamoDBDocument, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { BadRequestException, Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IGetTrackingDataParams, ISearchFaceByImageParams } from './tracking.type';
import { AWS_REKOGNITION_CLIENT } from 'src/aws/aws-rekognition.provider';
import { RekognitionClient, SearchFacesByImageCommand, SearchFacesCommand } from '@aws-sdk/client-rekognition';
import { AWS_S3_CLIENT } from '../aws/s3.provider';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ScanCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class TrackingService {
    constructor(
        private prisma: PrismaService,
        @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocument,
        @Inject(AWS_REKOGNITION_CLIENT) private readonly rekognitionClient: RekognitionClient,
        @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client
    ) {}

    /**
     * Fetches tracking data from aws
     * @param reqParams IGetTrackingDataParams
     * @param userId string
     * @returns Promise<any>
     */
    async getTrackingData(reqParams: IGetTrackingDataParams, userId?: string): Promise<any> {
        const params = new QueryCommand({
            TableName: 'recognised_facesNed2',
            IndexName: 'FaceIdIndex',  // Specify the GSI index name here
            KeyConditionExpression: "#field = :value",
            ExpressionAttributeNames: {
                "#field": "FaceId"
            },
            ExpressionAttributeValues: {
                ":value": reqParams.FaceId
            },
        });
    
        const getData = await this.dynamoDbClient.send(params);
        return getData.Items || [];
    }  

    /**
     * Searches known and unknow collections for faces with a particular faceId
     * @param param ISearchFaceByImageParams
     * @returns Tracking data
     */
    async searchFaceByImage(param : ISearchFaceByImageParams){
        const {base64Image, collectionId} = param
        const formattedBase64Image = base64Image.replace(/^data:.*;base64,/, "");
        const imageBytes = Buffer.from(formattedBase64Image, 'base64')

        //Seach collection for face
        const params = {
            CollectionId: collectionId,
            Image: {
                Bytes : imageBytes
            },
            MaxFaces: 20,
            FaceMatchThreshold: 80
          };
        const command = new SearchFacesByImageCommand(params);
        const response = await this.rekognitionClient.send(command)
        const { FaceMatches } = response

        //Search unknow collection if there are no matches
        if(response.FaceMatches.length === 0){
            const params = {
                CollectionId: 'other-rec-collection',
                Image: {
                    Bytes : imageBytes
                },
                MaxFaces: 20,
                FaceMatchThreshold: 80
              };
            const command = new SearchFacesByImageCommand(params);
            const response = await this.rekognitionClient.send(command);
            const { FaceMatches } = response
            const faceId = FaceMatches[0].Face.FaceId

            //Fetch tracking data
            if(faceId){
                const trackingData = await this.getTrackingData({FaceId : faceId})
                return trackingData
            } else {
                return new NotFoundException("No data found")
            }
        } else {
            //Fetch tracking data
            const faceId = FaceMatches[0].Face.FaceId
            if(faceId){
                const trackingData = await this.getTrackingData({FaceId : faceId})
                return trackingData
            } else {
                return new NotFoundException("No data found")
            }
        }
    }

    /**
     * Generates the image url from s3 key
     * @param s3Key string
     * @returns string
     */
    async generatePresignedUrl(s3Key: string, bucketName? : string) {
        try {
            const command = new GetObjectCommand({
              Bucket: bucketName ?? process.env.DETECTED_FACES_BUCKET,
              Key: s3Key,
            });
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 }); // URL valid for 60 minutes
            return url;
        } catch (error : any) {
            console.error({error})
            return new BadRequestException(`Error generating url: ${error.message}`)
        }
      }

    /**
     * Fetches tracking data from AWS DynamoDB based on a time range.
     * @param {string} startTimestamp The start of the time range (inclusive).
     * @param {string} endTimestamp The end of the time range (inclusive).
     * @returns {Promise<any>} The tracking data.
     */
    async getTrackingDataByTimeRange(
        faceId : string,
        startTimestamp: string,
        endTimestamp: string,
    ): Promise<any> {
        const params = new QueryCommand({
            TableName: 'recognised_facesNed2',
            IndexName: 'FaceIdIndexAndTimestamp',  // Specify the GSI index name
            KeyConditionExpression: "#faceId = :faceId AND #timestamp BETWEEN :start AND :end",
            ExpressionAttributeNames: {
                "#faceId": "FaceId",
                "#timestamp": "Timestamp"
            },
            ExpressionAttributeValues: {
                ":faceId": faceId,
                ":start": startTimestamp,
                ":end": endTimestamp
            }
        });
    
        try {
            const data = await this.dynamoDbClient.send(params);
            return data.Items || [];  // Return the data or an empty array if none
        } catch (error) {
            console.error("Error fetching data by FaceId and time range", error);
            throw new Error("Unable to fetch data");
        }
    }

    /**
     * Fetches tracking data from AWS DynamoDB based on userId and time range with pagination.
     * @param userId 
     * @param startTimestamp 
     * @param endTimestamp 
     * @param pageSize 
     * @param lastEvaluatedKey 
     * @returns 
     */
    async getTrackingDataByUserIdAndTimeRange(
        userId: string,
        startTimestamp: string,
        endTimestamp: string,
        pageSize: number = 100, // default page size
        lastEvaluatedKey?: string, // optional for pagination
    ): Promise<any> {
        const sevenDaysFromNow = new Date((new Date).getTime() - 7 * 24 * 60 * 60 * 1000);
        const startTimestampStr = startTimestamp ? new Date(startTimestamp).toISOString() : sevenDaysFromNow.toISOString();
        const endTimestampStr = endTimestamp ? new Date(endTimestamp).toISOString() : new Date().toISOString();

        const params = new QueryCommand({
            TableName: 'recognised_facesNed2',
            IndexName: 'UserIdAndTimestampIndex',
            KeyConditionExpression: "#userId = :userId AND #timestamp BETWEEN :start AND :end",
            ExpressionAttributeNames: {
                "#userId": "UserId",
                "#timestamp": "Timestamp"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":start": startTimestampStr,
                ":end": endTimestampStr
            },
            Limit: pageSize,
            ExclusiveStartKey: lastEvaluatedKey ? { "UserId": userId, "Timestamp": lastEvaluatedKey } : undefined,
        });

        try {
            const data = await this.dynamoDbClient.send(params);
            const detailedData = [];

            for (let item of data.Items) {
                const faceDetailsParams = new QueryCommand({
                    TableName: process.env.NIA_TABLE,
                    IndexName: 'FaceIdIndex',  // Specify the GSI index name
                    KeyConditionExpression: "#FaceId = :faceId",
                    ExpressionAttributeNames: {
                        "#FaceId": "FaceId",
                    },
                    ExpressionAttributeValues: {
                        ":faceId": item.FaceId,
                    }
                });
                const capturedImageUrl = item.S3Key ? await this.generatePresignedUrl(item.S3Key) : undefined;
                const getUserDetails = await this.dynamoDbClient.send(faceDetailsParams);
                const userDetails = getUserDetails.Items[0];
                const userImageUrl = userDetails?.S3Key ? await this.generatePresignedUrl(userDetails.S3Key, process.env.FACE_IMAGES_BUCKET) : undefined;
                detailedData.push({
                    ...item, 
                    imageUrl: capturedImageUrl, 
                    details: {
                        ...userDetails, 
                        imageUrl: userImageUrl
                    }
                });
            }

            // Return paginated result with LastEvaluatedKey for next pagination
            return {
                data: detailedData,
                lastEvaluatedKey: data.LastEvaluatedKey ? data.LastEvaluatedKey.Timestamp : undefined,
            };

        } catch (error) {
            console.error("Error fetching data by userId and time range", error);
            throw new Error("Unable to fetch data");
        }
    }

    /**
     * Fetches single tracking data by Id
     * @param id string
     * @returns tracking data
     */
    async getTrackingDataById(id : string){
        try {
            const params = new GetCommand({
                TableName : 'recognised_facesNed2',
                Key : { 'Id' : id }
            })
            const trackingData = await this.dynamoDbClient.send(params)
            const imageUrl = trackingData.Item.S3Key ? await this.generatePresignedUrl(trackingData.Item.S3Key) : undefined
            const detailedData = {
                ...trackingData.Item,
                imageUrl
            }
            return detailedData
        } catch (error) {
            console.error("Error fetching data by userId and time range", error);
            return new BadRequestException(error);
        }
    }

    /**
     * Executes a full text search on the number plate tracing table
     * @param partialNumberPlate string
     * @returns 
     */
    async searchNumberPlatePartial(partialNumberPlate: string): Promise<any> {
        if(partialNumberPlate.length > 0){
            const params = {
              TableName: `sam-app-3-NumberPlateTrackingTable`,
              FilterExpression: 'contains(#np, :partialNumberPlate)',
              ExpressionAttributeNames: {
                '#np': 'NormalizedNumberPlate',
              },
              ExpressionAttributeValues: {
                ':partialNumberPlate': { S: partialNumberPlate.toLowerCase() },
              },
            };
        
            try {
              const command = new ScanCommand(params);
              let result = await this.dynamoDbClient.send(command);
              const detailedData = []
              for(let item of result.Items){
                  const imageUrl = item.S3Key ? await this.generatePresignedUrl(item.S3Key.S, "sam-app-3-number-plate-capture-bucket") : undefined
                  detailedData.push({
                      ...item, 
                      imageUrl
                  })
              }
              return detailedData
            } catch (error) {
              console.error('Error in partial number plate search:', error);
              return new BadRequestException('Failed to search for partial number plate');
            }
        } else {
            return []
        }
      }

    async getTrackingDetailsByNumberPlateAndTimestamp(
        numberPlate : string,
        startTimestamp: string,
        endTimestamp: string,
    ): Promise<any> {
        console.log({numberPlate, startTimestamp, endTimestamp})
        const params = new QueryCommand({
            TableName: 'sam-app-3-NumberPlateTrackingTable',
            IndexName: 'NormalizedNumberPlateAndTimestampIndex',  // Specify the GSI index name
            KeyConditionExpression: "#numberPlate = :numberPlate AND #timestamp BETWEEN :start AND :end",
            ExpressionAttributeNames: {
                "#numberPlate": "NormalizedNumberPlate",
                "#timestamp": "Timestamp"
            },
            ExpressionAttributeValues: {
                ":numberPlate": numberPlate.toLowerCase(),
                ":start": startTimestamp,
                ":end": endTimestamp
            }
        });
    
        try {
            let response = await this.dynamoDbClient.send(params);
            const detailedData = []
            for(let item of response.Items){
                const imageUrl = item.S3Key ? await this.generatePresignedUrl(item.S3Key) : undefined
                detailedData.push({
                    ...item, 
                    imageUrl
                })
            }
            return detailedData
        } catch (error) {
            console.error("Error fetching data by userId and time range", error);
            throw new Error("Unable to fetch data");
        }
    }
}
