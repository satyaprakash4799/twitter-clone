import { Omit } from "lodash";
import { IPage } from "../interface/paginationInterface";
import { ITweet } from "../interface/tweetInterface";
import { Tweet } from "../models";

class TweetService {
  constructor() {
    this.getTweetById = this.getTweetById.bind(this);
  }

  public async getTweetById(tweetId: string, userId: string): Promise<ITweet | undefined> {
    const tweet = await Tweet.findOne({
      where: {
        userId,
        id: tweetId
      }
    });
    return tweet?.get({ plain: true });
  }

  public async createTweet(createTweetData: ITweet) {
    const newTweet = await Tweet.create(createTweetData);
    return newTweet.get({ plain: true });
  }

  public async getTweets(
    userId: string,
    { offset, limit }: IPage
  ): Promise<[count: number, tweets: ITweet[]]> {
    const { count, rows } = await Tweet.findAndCountAll({
      where: { userId },
      offset,
      limit,
      order: [
        ['createdAt', 'desc']
      ]
    });

    return [count, rows.map((row) => row.get({ plain: true }))];
  }

  public async updateTweet(tweetId: string, tweetData: Omit<ITweet, 'id' | 'createdAt' | 'updatedAt'| 'userId'  | 'parentId'>): Promise<[count: number, tweets: ITweet[]]> {
    const updates : {[key:string]: string | number} = {};

    if (tweetData?.replyType) { updates.replyType = tweetData.replyType}
    if (tweetData?.shareType) { updates.shareType = tweetData.shareType}
    if (tweetData?.sharedToType) { updates.sharedToType = tweetData.sharedToType }

    const [ affectedCount, affectedRows] = await Tweet.update(updates, {
      where: { id: tweetId},
      returning: true
    });

    return [ affectedCount, affectedRows.map(row => row.get({plain: true}))];
  }

  public async deleteTweet(tweetId: string, userId: string): Promise<number> {
    const deleteTweetCount = await Tweet.destroy({
      where: {
        id: tweetId,
        userId
      }
    });
    return deleteTweetCount;
  }
}

export { TweetService };
