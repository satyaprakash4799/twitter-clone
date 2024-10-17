import { Op } from "sequelize";
import { IUser } from "../interface/userInterface";
import { User, UserFollow, UserProfile } from "../models";
import { ErrorHandler } from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";
import { comparePassword as cmpPwd } from "../utils/utils";
import { sequelize } from "../config/dbConnection";

class UserService {
  public async getCurrentUser(id: string){
    return (await User.findByPk(id, {
      attributes: {
        include: [
          // Subquery for counting followers
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "UserFollows" WHERE "UserFollows"."userId" = "User"."id")`
            ),
            "followersCount",
          ],
          // Subquery for counting followings
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM "UserFollows" WHERE "UserFollows"."followerUserId" = "User"."id")`
            ),
            "followingsCount",
          ],
        ],
      },
      include: [
        { model: UserProfile, as: "userProfile" },
        // { model: UserFollow, as: "followers", attributes: [] }, // Remove specific attributes as they are calculated
        // { model: UserFollow, as: "followings", attributes: [] }, // Same as above
      ],
    })) as IUser | null;
  }

  public async createUser(
    userData: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<IUser> {
    const existingUser = (await User.findOne({
      where: {
        [Op.or]: [
          {
            username: userData?.username,
            email: userData?.email,
            phoneNumber: userData?.phoneNumber?.toString(),
          },
        ],
      },
    })) as IUser | null;
    if (existingUser) {
      throw new ErrorHandler(
        StatusCodes.CONFLICT,
        "User already exists with these details"
      );
    }
    let newUser = await User.create({
      ...userData,
    });
    return newUser.get({ plain: true });
  }

  public async userWithPassword(userData: {
    username: string;
    password: string;
  }): Promise<IUser | null> {
    const user = await User.scope("withPassword").findOne({
      where: {
        [Op.or]: [
          { username: userData?.username },
          { email: userData?.username },
          { phoneNumber: userData?.username },
        ],
      },
    });

    return user?.get({ plain: true }) as IUser | null;
  }
  public comparePassword(password: string, hashedPassword: string): boolean {
    return cmpPwd(password, hashedPassword);
  }
  public async updateUser(
    userId: string,
    userData: Omit<IUser, "id" | "createdAt" | "updatedAt">
  ): Promise<[affectedCount: number, affectedUsers: IUser[]]> {
    const { username = "", phoneNumber = "", email = "" } = userData;
    const existingUser = (await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { phoneNumber: phoneNumber },
          { email: email },
        ],
        id: { [Op.ne]: userId },
      },
    })) as IUser | null;
    if (existingUser) {
      throw new ErrorHandler(
        StatusCodes.CONFLICT,
        "User already exists with these details"
      );
    }

    const updates: { [key: string]: any } = {};

    if (userData?.username) updates.username = userData?.username;
    if (userData?.password) updates.password = userData?.password;
    if (userData?.phoneNumber) updates.phoneNumber = userData.phoneNumber;
    if (userData?.firstName) updates.firstName = userData?.firstName;
    if (userData?.lastName) updates.lastName = userData?.lastName;

    const [affectedCount, affectedUsers] = await User.update(updates, {
      where: {
        id: userId,
      },
      returning: true,
      individualHooks: true,
    });
    return [
      affectedCount,
      affectedUsers.map((user) => user.get({ plain: true })),
    ];
  }

  public async deleteUser(userId: string): Promise<number> {
    return await User.destroy({
      where: { id: userId },
    });
  }
}

export { UserService };
