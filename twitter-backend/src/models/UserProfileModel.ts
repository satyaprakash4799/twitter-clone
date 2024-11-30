import {DataTypes, Model} from "sequelize";

import {sequelize} from "../config/dbConnection";
import {User} from "./UserModel";
import {IUserProfile} from "../interface/userProfileInterface";
import {setDefaultYear} from "../utils/utils";

class UserProfile extends Model<IUserProfile> {
}

UserProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    userImage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id'
      },
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: setDefaultYear(20),
    }
  },
  {
    sequelize,
  }
);

export {UserProfile};
