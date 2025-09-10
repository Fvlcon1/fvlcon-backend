import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AWS_S3_CLIENT } from 'src/aws/s3.provider';
import { PrismaService } from 'src/prisma.service';
import { GetVideoLogDTO } from './videolog.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { FvlconizationLogs, FvlconizationVideoLogs } from '@prisma/client';
import { getNiaDetails } from 'utils/getNiaDetails';
import { getRecordDto } from 'src/criminal records/criminalRecords.dto';

@Injectable()
export class VideoLogsService {
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
  	async generateDownloadPresignedUrl(s3Key: string, bucket? : string): Promise<string> {
      try {
          const command = new GetObjectCommand({
              Bucket: bucket ?? process.env.FVLCONIZED_IMAGES_BUCKET, // Your S3 bucket name
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
	 * fetch Criminal record
	 * @param params 
	 * @returns 
	 */
	async getCriminalRecord(params : getRecordDto){
		const {niaTableId} = params
		const records = await this.prisma.criminalRecord.findMany({
		where : { niaTableId }
		})

		return records
	}

	async includeCroppedImageUrl(log:FvlconizationVideoLogs){
    const detailedOccurance = await Promise.all(
      log.occurance.map(async (item:any) => {
        if(item.croppedImageS3Key){
          const croppedImageUrl = await this.generateDownloadPresignedUrl(item.croppedImageS3Key, process.env.VIDEO_ANALYSIS_THUMBNAIL_BUCKET)
          item.croppedImageUrl = croppedImageUrl
        }
        return item
      })
    )
    log.occurance = detailedOccurance
    return log
  }

	async getVideoLog(params : GetVideoLogDTO){
		const {id, userId} = params

		// Query logs with optional filters
		const log = await this.prisma.fvlconizationVideoLogs.findFirst({
			where: { userId, id },
		});
		let uploadedImageUrl: any = undefined;
		if (log.thumbnailS3Key) {
			uploadedImageUrl = await this.generateDownloadPresignedUrl(log.thumbnailS3Key, process.env.VIDEO_ANALYSIS_THUMBNAIL_BUCKET)
		}
		const detailedLog = await this.includeCroppedImageUrl(log)

		return {
			...detailedLog,
			uploadedImageUrl
		}
	}
}