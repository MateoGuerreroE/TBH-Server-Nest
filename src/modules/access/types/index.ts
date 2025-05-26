import { IsEmail, IsOptional, IsString } from 'class-validator';

export interface UserLogin {
  emailAddress: string;
  entityId: string;
  role: 'user';
  fullName: string;
  token: string;
  expiration: string;
}

export interface AdminLogin {
  emailAddress: string;
  entityId: string;
  role: 'admin';
  isMaster: boolean;
  fullName: string;
  token: string;
  expiration: string;
}

export class LoginUserDTO {
  @IsString()
  token: string;
}

export class CreateUserDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  emailAddress: string;

  @IsString()
  @IsOptional()
  firebaseId?: string;
}
