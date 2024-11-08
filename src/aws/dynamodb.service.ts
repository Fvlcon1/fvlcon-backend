// dynamo-db.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocument, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class DynamoDbService {
  private readonly tableName: string;

  constructor(
    @Inject('DYNAMODB_CLIENT') private readonly dynamoDbClient: DynamoDBDocument,
    private readonly configService: ConfigService,
  ) {
    this.tableName = this.configService.get<string>('DYNAMODB_TABLE_NAME');
  }

  async createItem(item: Record<string, any>): Promise<any> {
    try {
      const params = new PutCommand({
        TableName: this.tableName,
        Item: item,
      });
      return await this.dynamoDbClient.send(params);
    } catch (error : any) {
      throw new Error(`Could not create item: ${error.message}`);
    }
  }

  async getItem(key: Record<string, any>): Promise<any> {
    try {
      const params = new GetCommand({
        TableName: this.tableName,
        Key: key,
      });
      const result = await this.dynamoDbClient.send(params);
      return result.Item;
    } catch (error : any) {
      throw new Error(`Could not get item: ${error.message}`);
    }
  }
}
