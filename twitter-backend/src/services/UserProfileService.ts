import { UserProfile } from "../models";

class UserProfileService {
  constructor() {}

  public async createProfile(userId: string): Promise<UserProfile> {
    return await UserProfile.create({
      userId: userId
    });
  }
}

export { UserProfileService };