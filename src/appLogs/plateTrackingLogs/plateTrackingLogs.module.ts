import { Module } from '@nestjs/common';
import { PlateTrackingLogsController } from './plateTrackingLogs.controller';
import { PlateTrackingLogsService } from './plateTrackingLogs.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [PlateTrackingLogsController],
  providers: [PlateTrackingLogsService, PrismaService],
})
export class PlateTrackingsLogsModule {}
