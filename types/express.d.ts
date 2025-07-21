import type { IUserLoginData, IAdminLoginData } from 'tbh-shared-types';

export type AuthType = IUserLoginData | IAdminLoginData | IVisitorLoginData;

export interface IVisitorLoginData {
  role: 'visitor';
  ip: string;
  sessionId: string;
  userAgent: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthType;
    }
  }
}
