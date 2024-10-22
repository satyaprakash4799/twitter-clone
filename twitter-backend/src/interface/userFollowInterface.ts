import { IUser } from "./userInterface";

export enum IFEED_TYPE {
  "ALL" = 0,
  "ALL_POSTS_AND_REPLIES" = 1,
  "NONE" = 2
};

export interface IUserFollow {
  id?: string;
  userId: string; // the person who is being followed
  followerUserId: string; //the person who is following the user
  disableFeed: boolean;
  feedType: IFEED_TYPE;
  createdAt?: string;
  updatedAt?: string;
  user?: IUser;

}