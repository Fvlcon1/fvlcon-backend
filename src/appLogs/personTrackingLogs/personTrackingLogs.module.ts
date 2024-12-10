import { Module } from '@nestjs/common';
import { PersonTrackingLogsController } from './personTrackingLogs.controller';
import { PersonTrackingLogsService } from './personTrackingLogs.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [PersonTrackingLogsController],
  providers: [PersonTrackingLogsService, PrismaService],
})
export class PersonTrackingsLogsModule {}
