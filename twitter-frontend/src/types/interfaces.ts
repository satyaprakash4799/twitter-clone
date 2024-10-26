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

export enum ISharedToType {
  EVERYONE = 'everyone',
}

export enum IReplyType {
  EVERYONE = 'everyone',
  ACCOUNTS_YOU_FOLLOW = 'accounts_you_follow',
  VERIFIED_ACCOUNTS = 'verified_accounts',
  ONLY_ACCOUNTS_YOU_MENTIONED = 'only_account_you_mentioned'
}

export enum IShareType {
  RE_POST = 're_post',
  QUOTE = 'quote'
}

export interface ITweet {
  id?: string;
  userId: string;
  parentId?: string;
  content: string;
  sharedToType: ISharedToType;
  replyType: IReplyType;
  shareType?: IShareType;
  createdAt?: string;
  updatedAt?: string;
  user?: IUser;
  replyCount?: number;
  shareCount?: number;
  likesCount?: number;
}
export interface ITweetLike {
  id?: string;
  userId: string;
  tweetId: string;
  createdAt?: string;
}
