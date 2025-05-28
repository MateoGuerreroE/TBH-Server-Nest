import { Module } from '@nestjs/common';
import { UserController } from './controller/User.controller';
import { UserService } from './services/User.service';
import { JwtService } from './services/Jwt.service';
import { DatasourceModule } from '../datasource';
import { LoggingModule } from '../logging';
import { FirebaseService } from './services/Firebase.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigModule } from '../config';

@Module({
  imports: [
    ConfigModule,
    LoggingModule.forContext('AccessModule'),
    DatasourceModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtService, FirebaseService, NestJwtService],
  exports: [UserService],
})
export class AccessModule {}
