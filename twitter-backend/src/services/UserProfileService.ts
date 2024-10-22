import { StatusCodes } from "http-status-codes";


import { IUserProfile } from "../interface/userProfileInterface";
import { UserProfile } from "../models";
import { ErrorHandler } from "../utils/ErrorHandler";

class UserProfileService {
  constructor() {
    this.createProfile = this.createProfile.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
    this.updateUserProfile = this.updateUserProfile.bind(this);
    this.deleteUserProfile = this.deleteUserProfile.bind(this);
  }

  public async createProfile(userData:IUserProfile): Promise<IUserProfile> {
    const existingUserProfile = await this.getUserProfile(userData?.userId);
    if (existingUserProfile) {
      throw new ErrorHandler(StatusCodes.CONFLICT, 'User Profile already exists.')
    }
    const { address=null, userId, userImage=null, dateOfBirth} = userData;
    const userProfile = await UserProfile.create({
      userId,
      address,
      userImage,
      dateOfBirth
    });
    return userProfile.get({ plain: true }) as IUserProfile;
  }

  public async getUserProfile(userId: string): Promise<IUserProfile | null> {
    return (await UserProfile.findOne({
      where: {
        userId,
      },
    })) as IUserProfile | null;
  }

  public async updateUserProfile(
    userId: string,
    userProfileData: Omit<
      IUserProfile,
      "id" | "userId" | "createdAt" | "updatedAt"
    >
  ): Promise<[affectedCount: number, affectedUserProfiles: IUserProfile[]]> {
    const updates: { [key: string]: any } = {};

    if (userProfileData?.address) updates.address = userProfileData.address;
    if (userProfileData?.userImage)
      updates.userImage = userProfileData.userImage;

    const [affectedCount, affectedUserProfiles] = await UserProfile.update(
      updates,
      {
        where: { userId },
        returning: true,
      }
    );
    return [
      affectedCount,
      affectedUserProfiles.map(
        (profile) => profile.get({ plain: true })
      ),
    ];
  }

  public async deleteUserProfile(userId: string): Promise<number>{
    return await UserProfile.destroy({where: { userId}})
  }
}

export { UserProfileService };
