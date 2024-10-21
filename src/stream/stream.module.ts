import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [StreamController],
  providers: [StreamService, PrismaService],
})
export class StreamModule {}
