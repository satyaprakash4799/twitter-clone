export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  phoneNumber: string;
  createdAt?: string;
  updatedAt?: string;
}