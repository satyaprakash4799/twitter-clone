import { Request, Response, NextFunction } from "express";

import { TweetService } from "../services/TweetService";
import {
  createTweetValidator,
  getTweetByIdValidator,
  tweetIdValidator,
  tweetUserIdValidator,
  updateTweetValidator,
} from "../middleware/validators/tweetValidator";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";
import { getOffset, getTotalPages } from "../utils/utils";
import { ITweet } from "../interface/tweetInterface";

class TweetController {
  private readonly tweetService: TweetService;
  constructor() {
    this.tweetService = new TweetService();
  }

  public async getTweetById(req: Request, res: Response, next: NextFunction) {
    try {
      const getTweetData = {
        tweetId: req.params?.tweetId,
        userId: req.user?.id,
      };

      const { error } = getTweetByIdValidator(getTweetData);

      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }

      const tweet = await this.tweetService.getTweetById(
        getTweetData.tweetId,
        getTweetData.userId
      );
      return res.status(StatusCodes.OK).json({
        tweet,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getTweets(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req?.query?.limit as string) || 10,
        page = parseInt(req?.query?.page as string) || 1,
        offset = getOffset(page, limit),
        userId = req?.user?.id;

      const [count, tweets] = await this.tweetService.getTweets(userId, {
        offset,
        limit,
      });
      const totalPages = getTotalPages(count, limit);

      return res.status(StatusCodes.OK).json({
        tweets,
        currentPage: page,
        totalPages,
        limit,
        totalItems: count,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async createTweet(req: Request, res: Response, next: NextFunction) {
    try {
      const tweetData: ITweet = req.body;
      const { error } = createTweetValidator(tweetData);
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }

      const newTweet = await this.tweetService.createTweet(tweetData);
      return res.status(StatusCodes.CREATED).json({
        message: "Tweet created successfully",
        tweet: newTweet,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async updateTweet(req: Request, res: Response, next: NextFunction) {
    try {
      const updateTweetData: Omit<
        ITweet,
        "id" | "createdAt" | "updatedAt" | "userId" | "parentId"
      > = req.body;
      const { tweetId } = req?.params;

      const { error: err } = tweetIdValidator({ tweetId });
      if (err) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          err?.details
        );
      }

      const { error } = updateTweetValidator(updateTweetData);
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }

      const [count, updatedTweets] = await this.tweetService.updateTweet(
        tweetId,
        updateTweetData
      );

      if (!count) {
        res.status(StatusCodes.OK).json({
          message: "Nothing to update.",
        });
      }
      return res.status(StatusCodes.OK).json({
        tweet: updatedTweets[0],
        message: "Tweet updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteTweet(req: Request, res: Response, next: NextFunction) {
    try {
      const { tweetId } = req?.params,
        userId = req?.user?.id;

      const { error } = tweetIdValidator({ tweetId });

      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }

      const deletedTweetCount = await this.tweetService.deleteTweet(
        tweetId,
        userId
      );

      if (deletedTweetCount === 0) {
        return res.status(StatusCodes.OK).json({
          message: "No tweet to delete",
        });
      }
      return res.status(StatusCodes.NO_CONTENT).json({
        message: "Tweet deleted successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getTweetsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const limit = parseInt(req?.query?.limit as string) || 10,
        page = parseInt(req?.query?.page as string) || 1,
        offset = getOffset(page, limit),
        { userId } = req?.params;
      const { error: err } = tweetUserIdValidator({ userId });
      if (err) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          err?.details
        );
      }
      const [count, tweets] = await this.tweetService.getTweets(userId, {
        offset,
        limit,
      });
      const totalPages = getTotalPages(count, limit);

      return res.status(StatusCodes.OK).json({
        currentPage: page,
        totalPages,
        limit,
        totalItems: count,
        tweets,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { TweetController };