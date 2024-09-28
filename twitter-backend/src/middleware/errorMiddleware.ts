import { Request, Response, NextFunction } from "express";
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
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

  return res.status(statusCode).json({
    message,
    details,
  });
};

export { errorMiddleware };
