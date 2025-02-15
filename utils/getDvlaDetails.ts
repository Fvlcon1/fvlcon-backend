import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const getDvlaDetails = async (plateNumber : string) => {
    try {
        const dynamoDbClient = new DynamoDBClient({ region: "us-east-1" })
        const params = new QueryCommand({
            TableName: process.env.DVLA_TABLE,
            IndexName: 'PlateNumberIndex',
            KeyConditionExpression: "#PlateNumber = :plateNumber",
            ExpressionAttributeNames: {
                "#PlateNumber": "PlateNumber",
            },
            ExpressionAttributeValues: {
                ":plateNumber": plateNumber,
            },
        });
        const getDvlaDetails = await dynamoDbClient.send(params)
        const dvlaDetails = getDvlaDetails.Items[0]
        return dvlaDetails
    } catch (error) {
        throw new Error(`Error getting DVLA details: ${error}`)
    }
}