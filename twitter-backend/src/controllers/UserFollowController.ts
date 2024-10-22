import { NextFunction, Request, Response } from "express";

import { IUserFollow } from "../interface/userFollowInterface";
import { UserFollowService } from "../services/UserFollowService";
import {
  createUserFollowValidator,
  updateUserFollowValidator,
} from "../middleware/validators/userFollowValidator";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";
import { getOffset, getTotalPages } from "../utils/utils";
import { userIdValidator } from "../middleware/validators/userValidator";

class UserFollowController {
  private readonly userFollowService: UserFollowService;

  constructor() {
    this.userFollowService = new UserFollowService();
    this.addUserFollow = this.addUserFollow.bind(this);
    this.getFollowers = this.getFollowers.bind(this);
    this.getFollowings = this.getFollowings.bind(this);
    this.updateFollower = this.updateFollower.bind(this);
    this.deleteFollower = this.deleteFollower.bind(this);
  }

  public async addUserFollow(req: Request, res: Response, next: NextFunction) {
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
      const userFollow = await this.userFollowService.addNewFollower(userData);
      return res.status(StatusCodes.CREATED).json({
        message: "Follower added successfully.",
        userFollow,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getFollowers(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req?.params;
      const page = parseInt(req?.query?.page as string) || 1,
        limit = parseInt(req?.query?.limit as string) || 10,
        offset = getOffset(page, limit);

      const { error } = userIdValidator({ userId });
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      const [count, users] = await this.userFollowService.getFollowers(userId, {
        limit,
        offset,
      });
      const totalPages = getTotalPages(count, limit);
      return res.status(StatusCodes.OK).json({
        currentPage: page,
        totalPages,
        totalItems: count,
        users,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getFollowings(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req?.params;
      const page = parseInt(req?.query?.page as string) || 1,
        limit = parseInt(req?.query?.limit as string) || 10,
        offset = getOffset(page, limit);

      const { error } = userIdValidator({ userId });
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      const [count, users] = await this.userFollowService.getFollowings(
        userId,
        { limit, offset }
      );
      const totalPages = getTotalPages(count, limit);
      return res.status(StatusCodes.OK).json({
        currentPage: page,
        limit,
        totalPages,
        totalItems: count,
        users,
      });
    } catch (error) {
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