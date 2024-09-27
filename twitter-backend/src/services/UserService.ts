import { Op } from "sequelize";
import { IUser } from "../interface/userInterface";
import { User, UserProfile } from "../models";

class UserService {
  public async getCurrentUser(id: string): Promise<User | null> {
    return await User.findOne({
      where: { id },
      include: { model: UserProfile, as: "userProfile" },
    });
  }

  public async createUser(userData: IUser): Promise<User> {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: userData?.username,
            email: userData?.email,
            phoneNumber: userData?.phoneNumber,
          },
        ],
      },
    });
    if (existingUser) {
      throw new Error("User already exists.");
    }
    const newUser = await User.create({
      ...userData,
    });
    return newUser;
  }

  public async userWithPassword(
    userData: Partial<IUser>
  ): Promise<User | null> {
    return await User.scope("withPassword").findOne({
      where: {
        [Op.or]: [
          { username: userData?.username },
          { email: userData?.username },
          { phoneNumber: userData?.username },
        ],
      },
    });
  }

  public async updateUser(
    userId: string,
    userData: Partial<IUser>
  ): Promise<[affectedCount: number, affectedUsers: User[]]> {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: userData?.username },
          { phoneNumber: userData?.phoneNumber },
          { email: userData?.email },
        ],
        id: { [Op.ne]: userId },
      },
    });

    if (existingUser) {
      throw new Error("Another user exists with same details.");
    }

    const updates: { [key: string]: any } = {};

    if (userData?.username) updates.username = userData?.username;
    if (userData?.password) updates.password = userData?.password;
    if (userData?.phoneNumber) updates.phoneNumber = userData.phoneNumber;
    if (userData?.firstName) updates.firstName = userData?.firstName;
    if (userData?.lastName) updates.lastName = userData?.lastName;

    return await User.update(updates, {
      where: {
        id: userId,
      },
      returning: true,
    });
  }

  public async deleteUser(userId: string) {
    return await User.destroy({
      where: { id: userId },
    });
  }
}

export { UserService };
