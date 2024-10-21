import { Module } from '@nestjs/common';
import { CameraFolderController } from './camFolder.controller';
import { CameraFolderService } from './camFolder.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  controllers: [CameraFolderController],
  providers: [CameraFolderService, PrismaService],
})
export class CameraFolderModule {}
