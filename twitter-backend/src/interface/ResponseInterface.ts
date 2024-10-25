import {IUser} from "./userInterface";
import {IUserProfile} from "./userProfileInterface";
import {IUserFollow} from "./userFollowInterface";
import {IPagination} from "./paginationInterface";


export interface IErrorResponse {
  message:string;
  details:string;
}

export interface IUserResponse {
  user: IUser | null;
  message?: string;
}

export interface ISignInResponse {
  token: string;
}

export interface IUserProfileResponse {
  userProfile: IUserProfile | null;
  message?: string;
}

export interface IUserFollowResponse {
  user: IUserFollow | null;
  message?: string;
}

export interface IUserFollowPaginationResponse extends IPagination<IUserFollow>{
  users: IUserFollow[];
}