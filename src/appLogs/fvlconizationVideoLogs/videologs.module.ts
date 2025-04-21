import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoLogsController } from './videologs.controller';
import { VideoLogsService } from './videologs.service';
import { PrismaService } from 'src/prisma.service';
import { awsS3ClientProvider } from 'src/aws/s3.provider';

@Module({
  imports: [ConfigModule],
  controllers: [VideoLogsController],
  providers: [VideoLogsService, PrismaService, awsS3ClientProvider],
})
export class FvlconizationVideoLogsModule {}