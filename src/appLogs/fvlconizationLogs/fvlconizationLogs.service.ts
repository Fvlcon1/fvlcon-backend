import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FvlconizationLogs, MediaTypes, StatusTypes } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Filters, FvlconizationLogsDto } from './fvlconizationLogs.type';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_S3_CLIENT } from 'src/aws/s3.provider';
import { PutObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { DynamoDBDocument, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class FvlconizationLogsService {
    constructor(
        private prisma: PrismaService,
        @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client,
        @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocument,
    ) {}

    /**
     * Generates a pre-signed URL for uploading an image to S3
     * @param fileName string - Name of the file to be uploaded
     * @param fileType string - MIME type of the file
     * @returns string - Pre-signed URL
     */
    async generateUploadPresignedUrl(filename? : string): Promise<string> {
        const uniqueFileName = `${uuidv4()}-${new Date()}`;
        try {
            const command = new PutObjectCommand({
                Bucket: 'fvlconized-images-bucket', // Your S3 bucket name
                Key: filename ?? uniqueFileName,
                ContentType: 'image/jpeg',
            });

            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 }); // URL valid for 60 minutes
            return url;
        } catch (error: any) {
            console.error('Error generating upload URL:', error);
            throw new BadRequestException(`Error generating upload URL: ${error.message}`);
        }
    }

    /**
     * Generates a pre-signed URL for accessing an image from S3
     * @param s3Key string - S3 key of the image
     * @returns string - Pre-signed URL
     */
    async generateDownloadPresignedUrl(s3Key: string): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: 'fvlconized-images-bucket', // Your S3 bucket name
                Key: s3Key,
            });

            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 }); // URL valid for 60 minutes
            return url;
        } catch (error: any) {
            console.error('Error generating download URL:', error);
            throw new BadRequestException(`Error generating download URL: ${error.message}`);
        }
    }

/**
 * Retrieves all Fvlconization logs for a user within a date range and optional filters
 * @param userId string - User ID
 * @param filters {
 *   startDate?: Date,       // Start of the date range
 *   endDate?: Date,         // End of the date range
 *   status?: StatusTypes,   // Status filter
 *   type?: MediaTypes       // Type filter
 * }
 * @returns Promise<FvlconizationLogsDto[]> - List of logs
 */
async getAllFvlconizationLogs(
  userId: string,
  filters: Filters
): Promise<FvlconizationLogs[]> {
  const { startDate, endDate, status, type } = filters;

  // Construct filters dynamically
  const dateFilter: any = {};
  if (startDate) dateFilter.gte = startDate;
  if (endDate) dateFilter.lte = endDate;

  const statusFilter = status ? { status : status.toLocaleLowerCase() as StatusTypes } : undefined;
  const typeFilter = type ? { type : type.toLocaleLowerCase() as MediaTypes} : undefined;

  // Query logs with optional filters
  const logs = await this.prisma.fvlconizationLogs.findMany({
    where: {
      userId,
      ...(Object.keys(dateFilter).length && { date: dateFilter }),
      ...statusFilter,
      ...typeFilter,
    },
  });

  const detailedLogs = await Promise.all(
    logs.map(async (log) => {
      const detailedMedia = await Promise.all(
        log.media.map(async (item) => {
          const mediaItem = item as any;
          let userDetails = undefined;

          if (mediaItem.matchedFaceId.length > 0) {
            console.log(mediaItem.matchedFaceId)
            const params = new QueryCommand({
              TableName: process.env.NIA_TABLE,
              IndexName: 'FaceIdIndex', // Specify the GSI index name
              KeyConditionExpression: "#FaceId = :faceId",
              ExpressionAttributeNames: {
                  "#FaceId": "FaceId", // Attribute in the GSI
              },
              ExpressionAttributeValues: {
                  ":faceId": mediaItem.matchedFaceId, // Ensure the value matches the DynamoDB type
              },
          });
            const getUserDetails = await this.dynamoDbClient.send(params)
            userDetails = getUserDetails.Items[0]
            console.log({userDetails})
          }

          if (mediaItem.segmentedImageS3key) {
            const imageUrl = await this.generateDownloadPresignedUrl(
              mediaItem.segmentedImageS3key
            );
            return {
              ...mediaItem,
              segmentedImageUrl: imageUrl,
              matchedPersonDetails: userDetails,
            };
          } else return item;
        })
      );
      let uploadedImageUrl: any = undefined;
      if (log.uploadedImageS3key) {
        uploadedImageUrl = await this.generateDownloadPresignedUrl(
          log.uploadedImageS3key
        );
      }
      return {
        ...log,
        media: detailedMedia,
        uploadedImageUrl,
      };
    })
  );
  return detailedLogs;
}

    /**
     * Adds a new Fvlconization log
     * @param data FvlconizationLogsDto - Log data
     * @param userId string - User ID
     * @returns Promise<FvlconizationLogs> - Created log entry
     */
    async addFvlconizationLogs(
        data: FvlconizationLogsDto,
        userId: string,
    ): Promise<FvlconizationLogs> {
        return await this.prisma.fvlconizationLogs.create({
            data: {
                user: { connect: { id: userId } },
                ...data,
            },
        });
    }

    /**
     * Deletes a Fvlconization log
     * @param id string - Log ID
     * @returns Promise<FvlconizationLogs> - Deleted log entry
     */
    async deleteFvlconizationLogs(id: string): Promise<FvlconizationLogs> {
        return await this.prisma.fvlconizationLogs.delete({
            where: { id },
        });
    }
}
