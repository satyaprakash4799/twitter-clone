import { IUserProfile } from "../interface/userProfileInterface";
import { UserProfile } from "../models";

class UserProfileService {
  constructor() {}

  public async createProfile(userId: string): Promise<IUserProfile> {
    const userProfile = await UserProfile.create({
      userId: userId,
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
        (profile) => profile.get({ plain: true }) as IUserProfile
      ),
    ];
  }

  public async deleteUserProfile(userId: string): Promise<number>{
    return await UserProfile.destroy({where: { userId}})
  }
}

export { UserProfileService };
