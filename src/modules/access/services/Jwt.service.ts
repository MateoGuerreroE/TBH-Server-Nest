import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/modules/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UserRecord } from 'src/modules/datasource';

@Injectable()
export class JwtService {
  private readonly secret: string;

  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.getJwtSecret();
  }

  signUserData(payload: UserRecord): { token: string; expiration: number } {
    const infoToSign = {
      fullName: `${payload.firstName} ${payload.lastName}`,
      emailAddress: payload.emailAddress,
      entityId: payload.userId,
      role: 'user',
    };

    const expirationTime = parseInt(
      this.configService.get<string>('JWT_EXPIRATION') ?? '3600',
      10,
    );
    const token = this.jwtService.sign(infoToSign, {
      secret: this.secret,
      expiresIn: expirationTime ?? 3600,
    });

    return {
      token,
      expiration: expirationTime,
    };
  }
}
