import { DataTypes, Model } from "sequelize";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../config/dbConnection";
import { User } from "./UserModel";
import { ErrorHandler } from "../utils/ErrorHandler";
import { IFEED_TYPE, IUserFollow } from "../interface/userFollowInterface";

class UserFollow extends Model<IUserFollow> {}

// Validation function for user following logic
const validateFollower = (userFollow: UserFollow) => {
  if (
    userFollow.dataValues.userId === userFollow.dataValues.followerUserId
  ) {
    throw new ErrorHandler(
      StatusCodes.BAD_REQUEST,
      "Validation Error",
      "User can't follow themselves."
    );
  }
};

UserFollow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    disableFeed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    feedType: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [Object.values(IFEED_TYPE)],
      },
      defaultValue: IFEED_TYPE.NONE,
      allowNull: false,
    },
    // the person who is being followed
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    // the person who is following the user
    followerUserId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    hooks: {
      beforeCreate: validateFollower,
    },
    indexes: [{ unique: true, fields: ["userId", "followerUserId"] }],
  }
);

export { UserFollow };
