import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection";
import { comparePassword as comparePwd, hashString } from "../utils/utils";

class User extends Model {
  public comparePassword(password: string) {
    return comparePwd(password, this.dataValues.password);
  }

  public withOutPassword() {
    delete this.dataValues.password;
    return this.dataValues;
  }
}
User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    indexes: [
      {
        fields: ["username", "phoneNumber"],
        unique: true,
      },
    ],
    hooks: {
      beforeCreate(user) {
        const password = user.dataValues.password;
        user.dataValues.password = hashString(password);
      },
      afterCreate(user, opts) {
        delete user.dataValues.password;
      },
      // beforeUpdate(instance, options) {

      // },
    },
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },
    scopes: {
      withPassword: {
        attributes: { include: [] },
      },
    },
  }
);

export { User };
