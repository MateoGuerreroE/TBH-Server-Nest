import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_TYPE_KEY, AuthType } from './discriminator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TokenTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route has an @Auth() decorator
    const requiredType: AuthType = this.reflector.get<AuthType>(
      AUTH_TYPE_KEY,
      context.getHandler(),
    );

    // If no @Auth() decorator is present, skip this guard
    if (!requiredType) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Express.Request>();
    const user = request.user;

    if (!user || !user.role)
      throw new UnauthorizedException('Invalid Access Token');

    if (requiredType !== user.role) {
      throw new UnauthorizedException('Access restricted');
    }

    return true;
  }
}
