export enum UserType {
  SuperAdmin = 'superAdmin',
  RootAdmin = 'rootAdmin',
  Admin = 'admin',
  PR = 'pr',
  Customer = 'customer',
  Guest = 'guest',
}

export interface IUser {
  uuid: string;
  username: string;
  email: string;
  tel: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  organizationUuid?: string;
  lastLoginAt?: Date;
  registeredAt?: Date;
  isActivated: boolean;
  isVerified: boolean;
  refreshToken?: string;
  imageKey?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUuid: string;
  updatedByUuid: string;
}
