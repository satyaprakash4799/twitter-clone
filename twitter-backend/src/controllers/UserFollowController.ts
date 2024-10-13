import { NextFunction, Request, Response } from "express";

import { IUserFollow } from "../interface/userFollowInterface";
import { UserFollowService } from "../services/UserFollowService";
import {
  createUserFollowValidator,
  getUserFollowValidator,
  updateUserFollowValidator,
} from "../middleware/validators/userFollowValidator";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";

class UserFollowController {
  private userFollowService: UserFollowService;

  constructor() {
    this.userFollowService = new UserFollowService();
    this.addUserFollow = this.addUserFollow.bind(this);
    this.getFollower = this.getFollower.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.getFollowing = this.getFollowing.bind(this);
    this.updateFollower = this.updateFollower.bind(this);
    this.deleteFollower = this.deleteFollower.bind(this);
  }

  public async addUserFollow(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData = {
      userId: req?.body?.targetUserId,
      disableFeed: req?.body?.disableFeed,
      feedType: req?.body?.feedType,
      followerUserId: req?.user?.id,
    } as IUserFollow;

    try {
      const { error } = createUserFollowValidator(userData);

      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      const userFollow = await this.userFollowService.addNewFollower(
        userData
      );
      return res.status(StatusCodes.CREATED).json({
        message: "Follower added successfully.",
        userFollow,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getFollower(req: Request, res: Response, next: NextFunction) {
    const { error } = getUserFollowValidator({
      userId: req?.params?.targetUserId,
      followerUserId: req?.user?.id,
    });
    try {
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      const follower = await this.userFollowService.getFollower(
        req?.params?.targetUserId,
        req?.user?.id,
      );

      if (!follower) {
        throw new ErrorHandler(StatusCodes.NOT_FOUND, "No follower details");
      }
      return res.status(StatusCodes.OK).json({
        follower,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const followers = await this.userFollowService.getFollowers(
        req?.user?.id
      );
      return res.status(StatusCodes.OK).json({
        followers,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getFollowing(req: Request, res: Response, next: NextFunction) {
    try{
      const following = await this.userFollowService.getFollowing(req?.user?.id);
      return res.status(StatusCodes.OK).json({
        following
      });
    }
    catch(error) {
      return next(error);
    }
  }

  public async updateFollower(req: Request, res: Response, next: NextFunction) {
    const userData = {
      userId: req?.params?.targetUserId,
      followerUserId: req?.user?.id,
      disableFeed: req?.body?.disableFeed,
      feedType: req?.body?.feedType,
    } as Omit<IUserFollow, "id" | "createdAt" | "updatedAt">;

    const { error } = updateUserFollowValidator(userData);

    try {
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      const [count, updatedFollower] =
        await this.userFollowService.updateFollower(userData);

      if (count === 0) {
        return res.status(StatusCodes.OK).json({
          message: "Nothing to update",
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "User follower updated successfully",
        following: updatedFollower[0],
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteFollower(req: Request, res: Response, next: NextFunction) {
    const userData = {
      userId: req?.params?.targetUserId,
      followerUserId: req?.user?.id,
    };

    try {
      await this.userFollowService.deleteFollower(
        userData?.userId,
        userData?.followerUserId
      );
      return res.status(StatusCodes.NO_CONTENT).json({
        message: "User follower deleted successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { UserFollowController };
