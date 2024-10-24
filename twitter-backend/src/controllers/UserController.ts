import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { omit } from 'lodash';

import { UserService } from "../services/UserService";
import {
  createUserValidator,
  signInValidator,
  updateUserValidator,
  usernameValidator,
} from "../middleware/validators/userValidator";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../interface/userInterface";
import { ErrorHandler } from "../utils/ErrorHandler";
import { UserProfileService } from "../services/UserProfileService";
import { IUserProfile } from "../interface/userProfileInterface";

class UserController {
  private userService: UserService;
  private userProfileService: UserProfileService;

  constructor() {
    this.userService = new UserService();
    this.userProfileService = new UserProfileService();
    this.createUser = this.createUser.bind(this);
    this.signIn = this.signIn.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
  }

  public async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = req?.user?.id;
      const { username } = req?.params;

      const { error } = usernameValidator({username});

      if (error ) { throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Validation Error', error?.details)}

      const user= await this.userService.getUser(currentUserId, username);
      return res.status(StatusCodes.OK).json({
        user,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUserId = req?.user?.id;
      
      const user= await this.userService.getCurrentUser(currentUserId);
      return res.status(StatusCodes.OK).json({
        user,
      });
    } catch (error) {
      return next(error);
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
      const user: IUser = await this.userService.createUser({
        firstName,
        lastName,
        username,
        password,
        phoneNumber,
        email,
      });

      await this.userProfileService.createProfile({ userId: user?.id } as IUserProfile);

      return res.status(StatusCodes.CREATED).json({
        message: "User created successfully.",
        user
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
      const isValidPassword = this.userService.comparePassword(password, user?.password as string);

      if (!isValidPassword) {
        throw new ErrorHandler(StatusCodes.BAD_REQUEST, "Invalid credentials");
      }

      user =  omit(user, 'password');

      const payload = { ...user };
      const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
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
