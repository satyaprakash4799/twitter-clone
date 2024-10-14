import { Request, Response, NextFunction } from "express";

import { UserBlockService } from "../services/UserBlockService";
import { userBlockValidator } from "../middleware/validators/userBlockValidator";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";
import { getTotalPages, getOffset } from "../utils/utils";

class UserBlockController {
  private readonly userBlockService: UserBlockService;

  constructor() {
    this.userBlockService = new UserBlockService();
    this.addBlockUser = this.addBlockUser.bind(this);
  }

  public async addBlockUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockedUserId } = req.params;
      const { id } = req?.user;
      const { error } = userBlockValidator({ blockedUserId });
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }

      const isUserBlocked = await this.userBlockService.getBlockerUser(
        id,
        blockedUserId
      );
      if (isUserBlocked)
        throw new ErrorHandler(
          StatusCodes.CONFLICT,
          "User is already blocked."
        );

      const user = await this.userBlockService.addBlockUser(id, blockedUserId);

      return res.status(StatusCodes.CREATED).json({
        message: "User blocked successfully.",
        user,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getBlockedUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { blockedUserId } = req.params;
      const { id } = req?.user;

      const { error } = userBlockValidator({ blockedUserId });
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }

      const user = await this.userBlockService.getBlockerUser(
        id,
        blockedUserId
      );
      return res.status(StatusCodes.OK).json({
        user,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async removeBlockedUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.user;
      const { blockedUserId } = req.params;

      const { error } = userBlockValidator({ blockedUserId });
      if (error)
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );

      const isUserBLocked = await this.userBlockService.getBlockerUser(
        id,
        blockedUserId
      );
      if (!isUserBLocked)
        throw new ErrorHandler(StatusCodes.BAD_REQUEST, "Nothing ");

      await this.userBlockService.removeBlockedUser(id, blockedUserId);
      return res
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "User unblocked successfully." });
    } catch (error) {
      return next(error);
    }
  }

  public async blockedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req?.query?.limit as string) || 10,
        page = parseInt(req?.query?.page as string) || 1,
        offset = getOffset(page, limit),
        { id } = req.user;

      const [count, blockedUsers] = await this.userBlockService.getBlockedUsers(id, { offset, limit });
      const totalPages = getTotalPages(count, limit)


      return res.status(StatusCodes.OK).json({
        users: blockedUsers,
        currentPage: page,
        totalPages,
        limit,
        totalItems: count
      });

    } catch (error) {
      return next(error);
    }
  }
}

export { UserBlockController };
