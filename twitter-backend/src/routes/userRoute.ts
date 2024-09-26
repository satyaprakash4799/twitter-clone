import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Model, Op } from "sequelize";
import jwt from "jsonwebtoken";

import {
  createUserValidator,
  signInValidator,
} from "../middleware/validators/userValidator";
import { User } from "../models/UserModel";
import { isUserAuthenticated } from "../middleware/auth.midddleware";
import { DisabledToken } from "../models";

const userRoute = express.Router();

userRoute.get("/", isUserAuthenticated, async (req: Request, res: Response) => {
  res.json({
    user: req.user,
  });
});

userRoute.post("/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, phoneNumber, email } =
    req.body;

  const { error } = createUserValidator(req.body);

  if (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: "Validation Error",
      errors: error.details.map((err) => err.message),
    });
  }

  try {
    const user = await User.create({
      firstName,
      lastName,
      phoneNumber,
      username,
      password,
      email,
    });
    res.status(StatusCodes.CREATED).json({
      msg: "User created successfully.",
      // user: user
    });
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      error: "Something went wrong!",
      details: error,
    });
  }
});

userRoute.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const { error } = signInValidator(req.body);

  if (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Validation Error",
      errors: error.details.map((err) => err.message),
    });
  }
  let user = await User.scope("withPassword").findOne({
    where: {
      [Op.or]: [
        {
          username: username,
        },
        {
          email: username,
        },
        {
          phoneNumber: username,
        },
      ],
    },
  });

  const isValidPassword = user?.comparePassword(password);

  if (!isValidPassword) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid credentials",
    });
  }

  user = user?.withOutPassword();

  try {
    const payload = { ...user };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1D",
    });
    res.status(StatusCodes.OK).json({
      token,
    });
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      error: "Something went wrong.",
      details: error,
    });
  }
});

userRoute.post(
  "/signout",
  isUserAuthenticated,
  async (req: Request, res: Response) => {
    const user = req.user,
      exp = new Date(user.exp * 1000);
    const token = req.headers["authorization"]?.split(" ")[1];
    console.log(token?.length);
    try {
      await DisabledToken.create({
        userId: user.id,
        token,
        expiresAt: exp.toISOString(),
      });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: error,
      });
    }

    res.status(StatusCodes.OK).json({
      message: "Session expired successfully",
    });
  }
);
export { userRoute };
