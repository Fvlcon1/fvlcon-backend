import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

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
        return userDetails
    } catch (error) {
        throw new Error(`Error getting NIA details: ${error}`)
    }
}