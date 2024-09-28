import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserService } from "../services/UserService";
import {
  createUserValidator,
  signInValidator,
  updateUserValidator,
} from "../middleware/validators/userValidator";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../interface/userInterface";
import { ErrorHandler } from "../utils/ErrorHandler";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.createUser = this.createUser.bind(this);
    this.signIn = this.signIn.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  public async getCurrentUser(req: Request, res: Response) {
    try {
      const currentUser = await this.userService.getCurrentUser(req?.user?.id);
      return res.status(StatusCodes.OK).json({
        user: currentUser,
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_GATEWAY).json({
        error: "Something went wrong.",
        details: error,
      });
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction) {
    const { firstName, lastName, username, password, phoneNumber, email } =
      req.body as IUser;
    const { error } = createUserValidator(req.body);

    try {
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      await this.userService.createUser({
        firstName,
        lastName,
        username,
        password,
        phoneNumber,
        email,
      });
      return res.status(StatusCodes.CREATED).json({
        message: "User created successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }

  public async signIn(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    const { error } = signInValidator(req.body);

    try {
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      let user = await this.userService.userWithPassword({
        username,
        password,
      });
      if (!user) {
        throw new ErrorHandler(StatusCodes.BAD_REQUEST, `User doesn't exist`);
      }

      const isValidPassword = user?.comparePassword(password);

      if (!isValidPassword) {
        throw new ErrorHandler(StatusCodes.BAD_REQUEST, "Invalid credentials");
      }

      user = user?.withOutPassword();
      const payload = { ...user };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: "1D",
      });
      return res.status(StatusCodes.OK).json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    const { username, password, phoneNumber, email, firstName, lastName } =
      req.body as IUser;

    try {
      const { error } = updateUserValidator(req.body);

      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_GATEWAY,
          "Validation Error",
          error?.details
        );
      }

      const [affectedCount, affectedUsers] = await this.userService.updateUser(
        req.user.id,
        { username, password, phoneNumber, email, firstName, lastName }
      );
      if (affectedCount === 0) {
        res.status(StatusCodes.OK).json({
          message: "Nothing to update.",
        });
      }

      return res.status(StatusCodes.OK).json({
        message: "User updated successfully.",
        user: affectedUsers?.[0],
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      // const deletedUserCount = await this.userService.deleteUser(req?.user?.id)
      // instead of deleting user, need to update another column like isDeleted
      return res.status(StatusCodes.NO_CONTENT).json({
        message: "User deleted successfully.",
      });
    } catch (error) {
      return next(error);
    }
  }
}

export { UserController };
