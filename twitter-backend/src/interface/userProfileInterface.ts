export interface IUserProfile {
  id?: string;
  address: string | null;
  userImage: string | null;
  userId: string;
  dateOfBirth: string;
  createdAt?: string;
  updatedAt?: string;
}