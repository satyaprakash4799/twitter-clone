import { DataTypes, Model } from "sequelize";

import { sequelize } from "../config/dbConnection";
import { User } from "./UserModel";
import { IUserProfile } from "../interface/userProfileInterface";

class UserProfile extends Model<IUserProfile> {}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    userImage: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    }
  },
  {
    sequelize,
  }
);

export { UserProfile };
