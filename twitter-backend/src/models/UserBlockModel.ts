import { DataTypes, Model } from "sequelize";

import { IUserBlock } from "../interface/userBlockInterface";
import { sequelize } from "../config/dbConnection";
import { User } from "./UserModel";

class UserBlock extends Model<IUserBlock> {
}

UserBlock.init({
  id:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  blockedUserId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  }
},{
  sequelize,
  timestamps: true
});

export { UserBlock };