import { DynamoDBDocument, GetCommand } from '@aws-sdk/lib-dynamodb';
import { Body, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { IGetTrackingDataParams } from './tracking.type';

@Injectable()
export class TrackingService {
    constructor(
        private prisma: PrismaService,
        @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocument
    ) {}

    async getTrackingData(reqParams : IGetTrackingDataParams, userId : string) : Promise<any> {
        console.log({reqParams})
        const params = new GetCommand({
            TableName : 'recognised_facesNed',
            Key : {
                FaceId : "92aec173-7684-4842-9476-d3ed72879c66",
                Timestamp : "2024-10-28T16:11:00.161148"
            }
        })
        const getData = await this.dynamoDbClient.send(params)
        return getData
    }
}
