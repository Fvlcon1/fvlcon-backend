import { Module } from '@nestjs/common';
import { StreamController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { PrismaService } from 'src/prisma.service';
import { awsRekognitionProvider } from 'src/aws/aws-rekognition.provider';
import { ConfigModule } from '@nestjs/config';
import { awsS3ClientProvider } from 'src/aws/s3.provider';

@Module({
  imports: [ConfigModule],
  controllers: [StreamController],
  providers: [TrackingService, PrismaService, awsRekognitionProvider, awsS3ClientProvider],
})
export class TrackingModule {}
