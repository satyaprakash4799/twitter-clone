export interface IUserProfile {
  id: string;
  address: string | null;
  userImage: string | null;
  userId: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  userProfile: IUserProfile;
  followingsCount: number;
  followersCount: number;
  tweetsCount: number;
}

export interface IPage {
  limit: number;
  page: number;
}

export interface IPagination<T> {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalItems: number;
  [key: string]: T[] | number;
}
