import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


import { isUserAuthenticated, notAuthenticated } from "../middleware/authMidddleware";
import { DisabledToken } from "../models";
import { UserController } from "../controllers/UserController";

const userRoute = express.Router();
const userController = new UserController();

userRoute.get("/", isUserAuthenticated, userController.getCurrentUser);

userRoute.post("/signup", notAuthenticated, userController.createUser);

userRoute.post("/signin", notAuthenticated , userController.signIn);

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
      return res.status(StatusCodes.OK).json({
        message: "Session expired successfully",
      });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Something went wrong.",
        details: error,
      });
    }
  }
);

userRoute.put("/", isUserAuthenticated, userController.updateUser);

userRoute.delete("/",isUserAuthenticated, userController.deleteUser);
export { userRoute };
