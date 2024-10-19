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
}
export interface ITweetLike {
  id?: string;
  userId: string;
  tweetId: string;
  createdAt?: string;
}