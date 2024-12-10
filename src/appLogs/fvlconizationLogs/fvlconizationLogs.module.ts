import { Module } from '@nestjs/common';
import { FvlconizationLogsController } from './fvlconizationLogs.controller';
import { FvlconizationLogsService } from './fvlconizationLogs.service';
import { PrismaService } from 'src/prisma.service';
import { awsS3ClientProvider } from 'src/aws/s3.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FvlconizationLogsController],
  providers: [FvlconizationLogsService, PrismaService, awsS3ClientProvider],
})
export class FvlconizationsLogsModule {}
