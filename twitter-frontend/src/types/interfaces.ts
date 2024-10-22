export interface IUserProfile {
  id: string;
  address: string | null;
  userImage: string | null;
  userId: string;
  dateOfBirth: string;
  createdAt?: string;
  updatedAt?: string;
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
  followersCount: number
}