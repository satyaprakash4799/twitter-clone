import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import {IErrorResponse} from "../interface/ResponseInterface";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response<IErrorResponse>,
  next: NextFunction
) => {
  let statusCode = err?.statusCode || 500;
  let message = err?.message || "Internal Server Error";
  let details = err?.details || null;

  // Handle Sequelize Database Error
  if (err instanceof DatabaseError) {
    statusCode = 500;
    message = "Database Error";
  }
  // Handle Sequelize Validation Error
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    details = err?.errors.map((e: any) => e.message);
  }

  // Handle Sequelize Unique Constraint Error
  if (err instanceof UniqueConstraintError) {
    statusCode = 409;
    message = "Unique Constraint Error";
    details = err?.errors.map((e: any) => e.message);
  }

  // Handle Sequelize Foreign Key Constraint Error
  if (err instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = "Foreign Key Constraint Error";
  }

  //Handle jwt token expiration
  if (err instanceof TokenExpiredError){
    statusCode = 403;
    message = "Token expired";
  }

  return res.status(statusCode).json({
    message,
    details,
  });
};

export { errorMiddleware };
