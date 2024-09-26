import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { DisabledToken } from "../models";

const isUserAuthenticated = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req["headers"]["authorization"];
  const token = authHeader?.split(" ")[1] ?? "";

  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: "Unauthorized",
      message: "No token provided, authorization denied",
    });
  }
  try {
    const isDisabledToken = await DisabledToken.findOne({
      where: {
        token: token
      }
    })
    if (isDisabledToken) {
      throw Error('Invalid token');
    }
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = user;

    next();
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Invalid token",
    });
  }
};

const notAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req["headers"]["authorization"];
  const token = authHeader?.split(" ")[1] ?? "";

  if (!token || !req?.user) {
    next();
  }

  res.status(StatusCodes.UNAUTHORIZED).json({
    error: "Unauthorized",
    message: "User is already authenticated",
  });
};

export { isUserAuthenticated, notAuthenticated };
