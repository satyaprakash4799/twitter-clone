import { StatusCodes } from "http-status-codes";
import { IUserFollow } from "../interface/userFollowInterface";
import { UserFollow } from "../models";
import { ErrorHandler } from "../utils/ErrorHandler";

class UserFollowService {
  constructor() {
    this.addNewFollower = this.addNewFollower.bind(this);
    this.getFollower = this.getFollower.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.updateFollower = this.updateFollower.bind(this);
    this.deleteFollower = this.deleteFollower.bind(this);
  }

  public async addNewFollower(userData: IUserFollow): Promise<IUserFollow> {
    const existingUserFollow = await this.getFollower(
      userData?.userId,
      userData?.followerUserId
    );

    if (existingUserFollow) {
      throw new ErrorHandler(
        StatusCodes.CONFLICT,
        "Validation Error",
        "Follower details already exists."
      );
    }

    const newFollower = await UserFollow.create(userData);
    return newFollower.get({ plain: true }) as IUserFollow;
  }

  public async getFollower(
    userId: string,
    followerUserId: string
  ): Promise<IUserFollow | undefined> {
    const isFollowing = await UserFollow.findOne({
      where: {
        userId,
        followerUserId,
      },
    });
    return isFollowing?.get({ plain: true });
  }

  public async getFollowers(userId: string): Promise<IUserFollow[]> {
    const followers = await UserFollow.findAll({
      where: {
        userId,
      },
      order: [
        ['createdAt', 'desc']
      ]
    });
    return followers.map((follower) =>
      follower.get({ plain: true })
    ) as IUserFollow[];
  }

  public async getFollowing(followerUserId: string): Promise<IUserFollow []>{
    const following = await UserFollow.findAll({
      where: { followerUserId},
      order: [
        ['createdAt', 'desc']
      ]
    });

    return following.map(f=> f.get({plain: true}));
  }

  public async updateFollower(
    followerData: Omit<IUserFollow, "id" | "createdAt" | "updatedAt">
  ): Promise<[affectedCount: number, affectedRows: IUserFollow[]]> {
    const existingUserFollower = await this.getFollower(
      followerData?.userId,
      followerData?.followerUserId
    );

    if (!existingUserFollower) {
      throw new ErrorHandler(
        StatusCodes.BAD_REQUEST,
        "Validation Error",
        `Follower details doesn't exists.`
      );
    }

    const updates: { [key: string]: any } = {};

    if (followerData?.disableFeed)
      updates.disableFeed = followerData.disableFeed;
    if (followerData?.feedType) updates.feedType = followerData.feedType;

    const [affectedCount, affectedFollowers] = await UserFollow.update(
      updates,
      {
        where: {
          userId: followerData?.userId,
          followerUserId: followerData?.followerUserId,
        },
        returning: true,
      }
    );

    return [
      affectedCount,
      affectedFollowers.map((follow) => follow.get({ plain: true })),
    ];
  }

  public async deleteFollower(userId: string, followerUserId: string): Promise<number> {
    return await UserFollow.destroy({
      where:{
        userId,
        followerUserId
      }
    })
  }
}

export { UserFollowService };
