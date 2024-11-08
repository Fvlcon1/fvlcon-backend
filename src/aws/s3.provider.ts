import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const AWS_S3_CLIENT = 'AWS_S3_CLIENT';

export const awsS3ClientProvider = {
  provide: AWS_S3_CLIENT,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  },
  inject: [ConfigService],
};
