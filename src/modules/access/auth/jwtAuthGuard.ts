import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AUTH_TYPE_KEY } from './discriminator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if the route has an @Auth() decorator
    const authType = this.reflector.get<string>(
      AUTH_TYPE_KEY,
      context.getHandler(),
    );

    // If no @Auth() decorator is present, allow access without authentication
    if (!authType) {
      return true;
    }

    // If @Auth() decorator is present, proceed with normal JWT authentication
    return super.canActivate(context);
  }
}
