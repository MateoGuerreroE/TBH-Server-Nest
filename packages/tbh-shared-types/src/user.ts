export interface ICreateUser {
  firstName: string;
  lastName: string;
  emailAddress: string;
  firebaseId?: string;
}

export interface ILoginUser {
  token: string;
}

interface SharedLoginData {
  emailAddress: string;
  entityId: string;
  fullName: string;
  token: string;
  expiration: string;
}

export interface IUserLoginData extends SharedLoginData {
  role: 'user';
}

export interface IAdminLoginData extends SharedLoginData {
  role: 'admin';
  isMaster: boolean;
}

export interface IUpdateUser {
  userId: string;
  firstName?: string;
  firebaseId?: string;
  lastName?: string;
  address?: string;
  city?: string;
  phone?: string;
  isEmailVerified?: boolean;
  lastLoginAt?: Date;
}

export interface ICreateAddress {
  userId: string;
  addressName: string;
  mainAddress: string;
  notes: string;
  city: string;
}
