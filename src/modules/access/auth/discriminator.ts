import { SetMetadata } from '@nestjs/common';

export type AuthType = 'visitor' | 'user' | 'admin';

export const AUTH_TYPE_KEY = 'auth:type';
export const Auth = (type: AuthType = 'visitor') =>
  SetMetadata(AUTH_TYPE_KEY, type);
