import { Module } from '@nestjs/common';
import { StreamController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [StreamController],
  providers: [TrackingService, PrismaService],
})
export class TrackingModule {}
