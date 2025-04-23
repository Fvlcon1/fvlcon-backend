import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { BadRequestException } from "@nestjs/common";

const s3Client = new S3Client()

/**
 * Generates the image url from s3 key
 * @param s3Key string
 * @returns string
 */
const generatePresignedUrl = async (s3Key: string, bucketName? : string) => {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName ?? process.env.DETECTED_FACES_BUCKET,
            Key: s3Key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 * 60 }); // URL valid for 60 minutes
        return url;
    } catch (error : any) {
        console.error({error})
        return new BadRequestException(`Error generating url: ${error.message}`)
    }
      }

export const getNiaDetails = async (faceId : string) => {
    try {
        const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" })
        const params = new QueryCommand({
            TableName: process.env.NIA_TABLE,
            IndexName: 'FaceIdIndex', // Specify the GSI index name
            KeyConditionExpression: "#FaceId = :faceId",
            ExpressionAttributeNames: {
                "#FaceId": "FaceId", // Attribute in the GSI
            },
            ExpressionAttributeValues: {
                ":faceId": faceId, // Ensure the value matches the DynamoDB type
            },
        });
        const getUserDetails = await dynamoDbClient.send(params)
        const userDetails = getUserDetails.Items[0]
        const userImageUrl = userDetails?.S3Key ? await generatePresignedUrl(userDetails.S3Key, process.env.FACE_IMAGES_BUCKET) : undefined;
        userDetails.imageUrl = userImageUrl

        return userDetails
    } catch (error) {
        throw new Error(`Error getting NIA details: ${error}`)
    }
}