import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAdminLoginData, IUserLoginData } from 'tbh-shared-types';
import { IVisitorLoginData } from 'types/express';

export const UserAuthor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserLoginData => {
    const request = ctx.switchToHttp().getRequest<Express.Request>();
    return request.user as IUserLoginData;
  },
);

export const AdminAuthor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IAdminLoginData => {
    const request = ctx.switchToHttp().getRequest<Express.Request>();
    return request.user as IAdminLoginData;
  },
);

export const VisitorAuthor = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IVisitorLoginData => {
    const request = ctx.switchToHttp().getRequest<Express.Request>();
    return request.user as IVisitorLoginData;
  },
);
