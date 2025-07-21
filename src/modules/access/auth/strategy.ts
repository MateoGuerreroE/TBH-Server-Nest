import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthType } from 'types/express';
import { AdminRepository } from '../../datasource/repositories';

const roleType = ['visitor', 'user', 'admin'];

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminRepository: AdminRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: AuthType): Promise<AuthType> {
    if (!payload || !payload.role || !roleType.includes(payload.role)) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    if (payload.role !== 'visitor') {
      if (!payload.entityId || !payload.emailAddress) {
        throw new UnauthorizedException(
          'Invalid JWT Payload: Missing attributes',
        );
      }
      if (payload.role === 'admin') {
        const admin = await this.adminRepository.getAdminById(payload.entityId);
        if (!admin) {
          throw new UnauthorizedException('Insufficient permissions');
        }
      }
    }

    return payload;
  }
}
