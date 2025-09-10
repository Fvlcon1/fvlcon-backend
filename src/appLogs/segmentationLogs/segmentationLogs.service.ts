import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MediaTypes, SegmentationLogs, StatusTypes } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Filters, SegmentationLogsDto } from './segmentationLogs.type';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { AWS_S3_CLIENT } from 'src/aws/s3.provider';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { validateInput } from '../utils/validation';
import { z } from 'zod';

@Injectable()
export class SegmentationLogsService {
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
                    Bucket: process.env.FVLCONIZED_IMAGES_BUCKET, // Your S3 bucket name
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
              Bucket: process.env.FVLCONIZED_IMAGES_BUCKET, // Your S3 bucket name
              Key: s3Key,
            });
            
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 }); // URL valid for 60 minutes
            return url;
          } catch (error: any) {
              console.log({s3Key})
              console.error('Error generating download URL:', error);
              throw new BadRequestException(`Error generating download URL: ${error.message}`);
          }
        }

    async getAllSegmentationLogs(userId : string, filters?: Filters) : Promise<SegmentationLogs[]> {
      let { startDate, endDate, status, type, page, pageSize, } = filters ?? {};

      //zod schema
      const schema = z.object({
        startDate : z.date().optional(),
        status : z.string().optional(),
        type : z.string().optional(),
        endDate : z.date().optional(),
        page : z.number().optional(),
        pageSize : z.number().optional()
      })

      //validate request body
      const validationBody = {startDate, endDate, page, pageSize, status, type}
      const {error} = validateInput(schema, validationBody)
      if(error) throw new BadRequestException(error);

      // Construct filters dynamically
      const dateFilter: any = {};
      if (startDate) dateFilter.gte = startDate;
      if (endDate) dateFilter.lte = endDate;
      page = page ?? 1
      pageSize = pageSize ?? 20
    
        const statusFilter = status ? { status : status.toLocaleLowerCase() as StatusTypes } : undefined;
        const typeFilter = type ? { type : type.toLocaleLowerCase() as MediaTypes} : undefined;
        
        const logs = await this.prisma.segmentationLogs.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where : { 
            userId,
            ...(Object.keys(dateFilter).length && { date: dateFilter }),
            ...statusFilter,
            ...typeFilter,
          },
          orderBy: {
            date: 'desc',
          },
        })

        const detailedLogs = await Promise.all(
          logs.map(async (log) => {
            const detailedMedia = await Promise.all(
              log.media.map(async (item) => {
                const mediaItem = item as any;
                if (mediaItem.segmentedImageS3key) {
                  const imageUrl = mediaItem.segmentedImageS3key ? await this.generateDownloadPresignedUrl(
                    mediaItem.segmentedImageS3key
                  ) : undefined
                  console.log({segmentedImageUrl: imageUrl})
                  return {
                    ...mediaItem,
                    segmentedImageUrl: imageUrl,
                  };
                } else return item;
              })
              );
              let uploadedImageUrl: any = undefined
              if (log.uploadedImageS3key) {
                uploadedImageUrl = log.uploadedImageS3key ? await this.generateDownloadPresignedUrl(
                  log.uploadedImageS3key
                ) : undefined
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

    async addSegmentationLogs(data : SegmentationLogsDto, userId : string) : Promise<SegmentationLogs> {
        const add = await this.prisma.segmentationLogs.create({
            data : {
                ...data,
                media : data.media as object[],
                user : { connect : { id : userId}},
            }
        })
        return add
    }

    async deleteSegmentationLogs(id : string) : Promise<SegmentationLogs> {
        return await this.prisma.segmentationLogs.delete({where : {id}})
    }
}
