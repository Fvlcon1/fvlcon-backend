import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';

export const AWS_REKOGNITION_CLIENT = 'AWS_REKOGNITION_CLIENT';

export const awsRekognitionProvider = {
  provide: AWS_REKOGNITION_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new RekognitionClient({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  },
  inject: [ConfigService],
};
