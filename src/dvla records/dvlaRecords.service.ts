import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocument, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { AWS_S3_CLIENT } from 'src/aws/s3.provider';
import { PrismaService } from 'src/prisma.service';
import { z } from 'zod';
import { addRecordDto, getRecordDto } from './dvlaRecords.dto';
import { getDvlaDetails } from 'utils/getDvlaDetails';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DvlaRecordService {
  constructor(
      private prisma: PrismaService,
      @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client,
      @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocument,
  ) {}

    /**
     * Generates a pre-signed URL for accessing an image from S3
     * @param s3Key string - S3 key of the image
     * @returns string - Pre-signed URL
     */
    async generateDownloadPresignedUrl(s3Key: string, bucket? : string): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: bucket ?? process.env.DVLA_AGENT_IMAGES_BUCKET,
                Key: s3Key,
            });
  
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 }); // URL valid for 60 minutes
            return url;
        } catch (error: any) {
            console.error('Error generating download URL:', error);
            throw new BadRequestException(`Error generating download URL: ${error.message}`);
        }
    }

  async addDvlaRecord(body : addRecordDto){
    
  }

  async getDvlaRecord(params : getRecordDto){
    const {plateNumber} = params
    
    const dvlaDetails = await getDvlaDetails(plateNumber)
    if(!dvlaDetails)
      return {}

    //Generate an image url for the agent and driver image
    const agentImageS3Key = dvlaDetails.S3Key
    const driverS3Key = dvlaDetails.driverS3Key
    const agentImageUrl = await this.generateDownloadPresignedUrl(agentImageS3Key)
    const driverImageUrl = await this.generateDownloadPresignedUrl(driverS3Key, process.env.DVLA_DRIVER_IMAGES_BUCKET)

    return {...dvlaDetails, agentImageUrl, driverImageUrl}
  }
}