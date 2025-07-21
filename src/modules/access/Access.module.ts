import { Module } from '@nestjs/common';
import { UserController } from './controller/User.controller';
import { UserService } from './services/User.service';
import { JwtService } from './services/Jwt.service';
import { DatasourceModule } from '../datasource';
import { LoggingModule } from '../logging';
import { FirebaseService } from './services/Firebase.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigModule } from '../config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuthGuard';
import { TokenTypeGuard } from './auth/tokenTypeGuard';
import { JwtStrategy } from './auth/strategy';

@Module({
  imports: [
    ConfigModule,
    LoggingModule.forContext('AccessModule'),
    DatasourceModule,
  ],
  controllers: [UserController],
  providers: [
    JwtStrategy,
    UserService,
    JwtService,
    FirebaseService,
    NestJwtService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TokenTypeGuard },
  ],
  exports: [UserService],
})
export class AccessModule {}
