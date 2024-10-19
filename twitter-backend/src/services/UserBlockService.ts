import { StatusCodes } from "http-status-codes";
import { IUserBlock } from "../interface/userBlockInterface";
import { UserBlock } from "../models/UserBlockModel";
import { ErrorHandler } from "../utils/ErrorHandler";
import { IPage } from "../interface/paginationInterface";
import { User, UserProfile } from "../models";

class UserBlockService {
  constructor() {
    this.addBlockUser = this.addBlockUser.bind(this);
    this.getBlockerUser = this.getBlockerUser.bind(this);
    this.removeBlockedUser = this.removeBlockedUser.bind(this);
  }

  public async getBlockerUser(
    userId: string,
    blockedUserId: string
  ): Promise<IUserBlock | undefined> {
    const blockedUser = await UserBlock.findOne({
      where: {
        userId,
        blockedUserId,
      },
    });
    return blockedUser?.get({ plain: true });
  }

  public async addBlockUser(
    userId: string,
    blockedUserId: string
  ): Promise<IUserBlock> {
    const existingBlockedUser = await this.getBlockerUser(
      userId,
      blockedUserId
    );

    if (existingBlockedUser)
      throw new ErrorHandler(StatusCodes.CONFLICT, "User is already blocked");

    const blockedUser = await UserBlock.create({
      userId,
      blockedUserId,
    });
    return blockedUser.get({ plain: true });
  }

  public async removeBlockedUser(
    userId: string,
    blockedUserId: string
  ): Promise<number> {
    return await UserBlock.destroy({
      where: {
        userId,
        blockedUserId,
      },
    });
  }

  public async getBlockedUsers(
    userId: string,
    { offset, limit }: IPage
  ): Promise<[count: number, users: IUserBlock[]]> {
    const { count, rows } = await UserBlock.findAndCountAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          include: [
            {
              model: UserProfile,
              as: "userProfile",
            },
          ],
        },
      ],
      limit,
      offset,
    });
    return [count, rows.map((row) => row.get({ plain: true }))];
  }
}

export { UserBlockService };
