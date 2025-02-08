import { Module } from '@nestjs/common';
import { CriminalRecordsController } from './criminalRecords.controller';
import { CriminalRecordsService } from './criminalRecords.service';
import { PrismaService } from 'src/prisma.service';
import { awsS3ClientProvider } from 'src/aws/s3.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [CriminalRecordsController],
  providers: [CriminalRecordsService, PrismaService, awsS3ClientProvider],
})
export class CriminalRecordsModule {}
