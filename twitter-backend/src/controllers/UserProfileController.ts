import { Request, Response, NextFunction } from "express";

import { UserProfileService } from "../services/UserProfileService";
import { IUserProfile } from "../interface/userProfileInterface";
import { createUserProfileValidator, profileImageTypeValidator, updateUserProfileValidator } from "../middleware/validators/userProfileValidator";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";

class UserProfileController {
  private userProfileService: UserProfileService;

  constructor() {
    this.userProfileService = new UserProfileService();
    this.createUserProfile = this.createUserProfile.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.deleteUserProfile = this.deleteUserProfile.bind(this);
  }

  public async createUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userData = {
      userId: req?.user?.id,
      address: req?.body?.address,
      userImage: req?.body?.userImage
    } as IUserProfile;

    const { error } = createUserProfileValidator(userData);

    try {
      if (error) {
        throw new ErrorHandler(
          StatusCodes.BAD_REQUEST,
          "Validation Error",
          error?.details
        );
      }
      const newUserProfile = await this.userProfileService.createProfile(userData);
      return res.status(StatusCodes.CREATED).json({
        userProfile: newUserProfile,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userProfile = await this.userProfileService.getUserProfile(
        req?.user?.id
      );
      return res.status(StatusCodes.OK).json({
        userProfile,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    const { address, dateOfBirth } = req.body as IUserProfile;

    const files = req.files;

    const userFile = files && files.length ? files?.[0] : {} as Express.Multer.File;

    try{
      const { error:imageTypeError } = profileImageTypeValidator({mimetype: userFile.mimetype});
      if (imageTypeError) { throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Validation Error', imageTypeError?.details)}

      const { error } = updateUserProfileValidator(req.body);
      if (error) { throw new ErrorHandler(StatusCodes.BAD_REQUEST, 'Validation Error', error?.details)};

      const encodedImage = userFile?.buffer.toString('base64');
      let userImage = encodedImage ? `data:${userFile.mimetype};base64, ${encodedImage}`:null;

      const [count, userProfile] = await this.userProfileService.updateUserProfile(req?.user?.id, {address, userImage, dateOfBirth });

      if (count ==0){ return res.status(StatusCodes.OK).json({message: 'Nothing to update.'})}

      return res.status(StatusCodes.OK).json({
        message: 'User profile updated successfully.',
        userProfile: userProfile[0]
      })
    }
    catch(error) {
      return next(error);
    }
  }

  public async deleteUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.userProfileService.deleteUserProfile(req?.user?.id);
      return res.status(StatusCodes.NO_CONTENT).json({
        message: 'User Profile deleted successfully.'
      })
    } catch (error) {
      return next(error);
    }
  }
}

export { UserProfileController };