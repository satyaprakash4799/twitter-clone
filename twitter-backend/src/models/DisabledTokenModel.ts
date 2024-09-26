import { DataTypes, Model, Sequelize } from "sequelize";

import { sequelize } from "../config/dbConnection";
import { User } from "./UserModel";

class DisabledToken extends Model {}

DisabledToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model:User,
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, createdAt: false, updatedAt: false }
);

export { DisabledToken };