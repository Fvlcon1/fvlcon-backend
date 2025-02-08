import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocument, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, Inject } from '@nestjs/common';
import { AWS_S3_CLIENT } from 'src/aws/s3.provider';
import { PrismaService } from 'src/prisma.service';
import { z } from 'zod';
import { addRecordDto, getRecordDto } from './criminalRecords.dto';

@Injectable()
export class CriminalRecordsService {
  constructor(
      private prisma: PrismaService,
      @Inject(AWS_S3_CLIENT) private readonly s3Client: S3Client,
      @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocument,
  ) {}

  async addCriminalRecord(body : addRecordDto){
    return await this.prisma.criminalRecord.create({
      data : {
        ...body
      }
    })
  }

  async getCriminalRecord(params : getRecordDto){
    const {niaTableId} = params
    const records = await this.prisma.criminalRecord.findMany({
      where : { niaTableId }
    })

    // Fetch the NIA details for all records
    // const detailedRecords = await Promise.all(
    //   records.map(async (record) => {
    //     const niaTableId = record.niaTableId;
    //     const params = new GetCommand({
    //       TableName: process.env.NIA_TABLE,
    //       Key: { Id: niaTableId },
    //     });

    //     const niaRecord = await this.dynamoDbClient.send(params);
    //     return {
    //       ...record,
    //       niaRecord : niaRecord.Item
    //     }
    //   })
    // );

    return records
  }
}