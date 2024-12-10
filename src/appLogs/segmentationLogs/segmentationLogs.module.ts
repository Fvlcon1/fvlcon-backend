import { Module } from '@nestjs/common';
import { SegmentationLogsController } from './segmentationLogs.controller';
import { SegmentationLogsService } from './segmentationLogs.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [SegmentationLogsController],
  providers: [SegmentationLogsService, PrismaService],
})
export class SegmentationsLogsModule {}
