import { Module } from '@nestjs/common';
import { SegmentationLogsController } from './segmentationLogs.controller';
import { SegmentationLogsService } from './segmentationLogs.service';
import { PrismaService } from 'src/prisma.service';
import { awsS3ClientProvider } from 'src/aws/s3.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SegmentationLogsController],
  providers: [SegmentationLogsService, PrismaService, awsS3ClientProvider],
})
export class SegmentationsLogsModule {}
