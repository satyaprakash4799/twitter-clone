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
  return res.json({
    user: req.user,
  });
});

userRoute.post("/signup", async (req: Request, res: Response) => {
  const { firstName, lastName, username, password, phoneNumber, email } =
    req.body;

  const { error } = createUserValidator(req.body);

  if (error) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: "Validation Error",
      errors: error.details.map((err) => err.message),
    });
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or] : [
          {
            username: username,
            email: email,
            phoneNumber: phoneNumber.toString()
          }
        ]
      }
    })
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'User already exists.'
      })
    }
    await User.create({
      firstName,
      lastName,
      phoneNumber,
      username,
      password,
      email,
    });
    return res.status(StatusCodes.CREATED).json({
      msg: "User created successfully.",
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
      error: "Something went wrong!",
      details: error,
    });
  }
});

userRoute.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const { error } = signInValidator(req.body);

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
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
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: `User doesn't exist`
    })
  }
  const isValidPassword = user?.comparePassword(password);

  if (!isValidPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid credentials",
    });
  }

  user = user?.withOutPassword();

  try {
    const payload = { ...user };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1D",
    });
    return res.status(StatusCodes.OK).json({
      token,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_GATEWAY).json({
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

    return res.status(StatusCodes.OK).json({
      message: "Session expired successfully",
    });
  }
);
export { userRoute };
