import { DataTypes, Model } from "sequelize";
import { StatusCodes } from "http-status-codes";

import { sequelize } from "../config/dbConnection";
import {
  IReplyType,
  ISharedToType,
  IShareType,
  ITweet,
  ITweetLike,
} from "../interface/tweetInterface";
import { User } from "./UserModel";
import { ErrorHandler } from "../utils/ErrorHandler";

class Tweet extends Model<ITweet> {}

// Validation function for parent tweet logic
const validateParentTweet = (tweet: Tweet) => {
  if (tweet.dataValues.id === tweet.dataValues.parentId) {
    throw new ErrorHandler(
      StatusCodes.BAD_REQUEST,
      "Validation Error",
      "Tweet id and parent id can't be same."
    );
  }
};
Tweet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      references: {
        model: Tweet,
        key: "id",
      },
      allowNull: true,
    },
    content: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },
    sharedToType: {
      type: DataTypes.ENUM(...Object.values(ISharedToType)),
      defaultValue: ISharedToType.EVERYONE,
      allowNull: false,
    },
    replyType: {
      type: DataTypes.ENUM(...Object.values(IReplyType)),
      defaultValue: IReplyType.EVERYONE,
      allowNull: false,
    },
    shareType: {
      type: DataTypes.ENUM(...Object.values(IShareType)),
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    indexes: [{ fields: ["parentId", "createdAt"] }],
    hooks: {
      beforeCreate: validateParentTweet,
    },
  }
);

class TweetLike extends Model<ITweetLike> {}

TweetLike.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    tweetId: {
      type: DataTypes.UUID,
      references: {
        model: Tweet,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ["userId", "tweetId"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  }
);

export { Tweet, TweetLike };
