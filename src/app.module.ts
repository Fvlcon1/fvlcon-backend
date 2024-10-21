import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamModule } from './stream/stream.module';
import { ConfigModule } from '@nestjs/config';
import { CameraFolderModule } from './camera folder/camFolder.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    StreamModule,
    CameraFolderModule,
    UserModule,
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
