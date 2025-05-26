export type UserRecord = {
  userId: string;
  firstName: string;
  lastName: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isEnabled: boolean;
  emailAddress: string;
  firebaseId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastLoginAt: Date | null;
  deletedBy: string;
};

export type UserRecordWithRelation = UserRecord & {
  deletedByAdmin: AdminRecord | null;
};

export type AdminRecord = {
  adminId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isEnabled: boolean;
  emailAddress: string;
  firebaseId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastLoginAt: Date | null;
};

export interface CreateUserData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  firebaseId?: string;
}

export interface UpdateUserData {
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
