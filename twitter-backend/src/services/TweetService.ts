import { Omit } from "lodash";
import { IPage } from "../interface/paginationInterface";
import { ITweet, ITweetLike } from "../interface/tweetInterface";
import { Tweet, User, UserProfile } from "../models";
import { TweetLike } from "../models/TweetModel";
import { sequelize } from "../config/dbConnection";


class TweetService {
  constructor() {
    this.getTweetById = this.getTweetById.bind(this);
    this.createTweet = this.createTweet.bind(this);
    this.deleteTweet = this.deleteTweet.bind(this);
    this.getTweets = this.getTweets.bind(this);
    this.updateTweet = this.updateTweet.bind(this);
  }

  public async getTweetById(
    tweetId: string,
    userId: string
  ): Promise<ITweet | undefined> {
    const tweet = await Tweet.findOne({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Tweets" WHERE "Tweets"."shareType" = null AND "Tweets"."parentId" = "Tweet"."id")`
            ),
            "replyCount",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Tweets" WHERE "Tweets"."shareType" IS NOT NULL AND "Tweets"."parentId" = "Tweet"."id")`
            ),
            "shareCount",
          ],
        ],
      },
      where: {
        userId,
        id: tweetId,
      },
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
      where: { userId,
        shareType : null as any
      },
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Tweets" WHERE "Tweets"."shareType" IS NULL AND "Tweets"."parentId" = "Tweet"."id")`
            ),
            "replyCount",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "Tweets" WHERE "Tweets"."shareType" IS NOT NULL AND "Tweets"."parentId" = "Tweet"."id")`
            ),
            "shareCount",
          ],
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "TweetLikes" WHERE "TweetLikes"."tweetId" = "Tweet"."id")`
            ),
            "likesCount",
          ],
        ],
      },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: UserProfile,
              as: "userProfile",
            },
          ],
        },
      ],
      offset,
      limit,
      order: [["createdAt", "desc"]],
    });

    return [count, rows.map((row) => row.get({ plain: true }))];
  }

  public async updateTweet(
    tweetId: string,
    tweetData: Omit<
      ITweet,
      "id" | "createdAt" | "updatedAt" | "userId" | "parentId"
    >
  ): Promise<[count: number, tweets: ITweet[]]> {
    const updates: { [key: string]: string | number } = {};

    if (tweetData?.replyType) {
      updates.replyType = tweetData.replyType;
    }
    if (tweetData?.shareType) {
      updates.shareType = tweetData.shareType;
    }
    if (tweetData?.sharedToType) {
      updates.sharedToType = tweetData.sharedToType;
    }

    const [affectedCount, affectedRows] = await Tweet.update(updates, {
      where: { id: tweetId },
      returning: true,
    });

    return [affectedCount, affectedRows.map((row) => row.get({ plain: true }))];
  }

  public async deleteTweet(tweetId: string, userId: string): Promise<number> {
    const deleteTweetCount = await Tweet.destroy({
      where: {
        id: tweetId,
        userId,
      },
    });
    return deleteTweetCount;
  }
}

class TweetLikeService {
  constructor() {
    this.createLike = this.createLike.bind(this);
    this.getLike = this.getLike.bind(this);
    this.getLikedTweetByUsers = this.getLikedTweetByUsers.bind(this);
    this.getTweetLikedByUser = this.getTweetLikedByUser.bind(this);
    this.removeLike = this.removeLike.bind(this);
  }

  public async createLike(tweetLikeData: ITweetLike) {
    const createLike = await TweetLike.create(tweetLikeData);
    return createLike.get({ plain: true });
  }

  public async getLike(
    tweetLikeData: ITweetLike
  ): Promise<ITweetLike | undefined> {
    const getLike = await TweetLike.findOne({
      where: {
        tweetId: tweetLikeData?.tweetId,
        userId: tweetLikeData?.userId,
      },
    });
    return getLike?.get({ plain: true });
  }

  public async removeLike(tweetId: string, userId: string): Promise<number> {
    return await TweetLike.destroy({
      where: {
        userId,
        tweetId,
      },
    });
  }

  public async getLikedTweetByUsers(
    tweetId: string,
    { offset, limit }: IPage
  ): Promise<[count: number, tweetLikeList: ITweetLike[]]> {
    const getTweetLikeData = await TweetLike.findAndCountAll({
      where: { tweetId },
      offset,
      limit,
      order: [["createdAt", "desc"]],
    });
    return [
      getTweetLikeData?.count,
      getTweetLikeData?.rows.map((row) => row.get({ plain: true })),
    ];
  }

  public async getTweetLikedByUser(
    userId: string,
    { offset, limit }: IPage
  ): Promise<[count: number, tweetsLikes: ITweetLike[]]> {
    const { count, rows } = await TweetLike.findAndCountAll({
      where: {
        userId,
      },
      offset,
      limit,
      order: [["createdAt", "desc"]],
    });

    return [count, rows.map((row) => row.get({ plain: true }))];
  }
}

export { TweetService, TweetLikeService };
