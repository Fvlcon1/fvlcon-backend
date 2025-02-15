import { Module } from '@nestjs/common';
import { DvlaRecordController } from './dvlaRecords.controller';
import { DvlaRecordService } from './dvlaRecords.service';
import { PrismaService } from 'src/prisma.service';
import { awsS3ClientProvider } from 'src/aws/s3.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [DvlaRecordController],
  providers: [DvlaRecordService, PrismaService, awsS3ClientProvider],
})
export class DvlaRecordModule {}
