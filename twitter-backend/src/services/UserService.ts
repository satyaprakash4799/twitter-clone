import { Op } from "sequelize";
import { IUser } from "../interface/userInterface";
import { User, UserProfile } from "../models";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";

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
            phoneNumber: (userData?.phoneNumber)?.toString(),
          },
        ],
      },
    });
    if (existingUser) {
      throw new ErrorHandler(StatusCodes.CONFLICT, 'User already exists with these details');
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
    const { username='', phoneNumber='', email=''} = userData;
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { phoneNumber: phoneNumber },
          { email: email },
        ],
        id: { [Op.ne]: userId },
      },
    });
    if (existingUser) {
      throw new ErrorHandler(StatusCodes.CONFLICT, 'User already exists with these details');
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
      individualHooks: true
    });
  }

  public async deleteUser(userId: string) {
    return await User.destroy({
      where: { id: userId },
    });
  }
}

export { UserService };
