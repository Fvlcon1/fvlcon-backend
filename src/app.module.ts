import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StreamModule } from './stream/stream.module';
import { ConfigModule } from '@nestjs/config';
import { CameraFolderModule } from './camera folder/camFolder.module';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TrackingModule } from './tracking/tracking.module';
import { DynamoDBModule } from './aws/dynamodb.module';
import { awsRekognitionProvider } from './aws/aws-rekognition.provider';

@Module({
  imports: [
    StreamModule,
    CameraFolderModule,
    UserModule,
    TrackingModule,
    DynamoDBModule,
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
  ],
})
export class AppModule {}
