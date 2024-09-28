import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbConnection";
import { comparePassword as comparePwd, hashString } from "../utils/utils";
import { IUser } from "../interface/userInterface";

class User extends Model<IUser> {
  public comparePassword(password: string) {
    return comparePwd(password, this.dataValues.password as string);
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
        fields: ["username", "phoneNumber", "email"],
        unique: true,
      },
    ],
    hooks: {
      beforeCreate(user) {
        const password = user.dataValues.password as string;
        user.dataValues.password = hashString(password);
      },
      afterCreate(user, opts) {
        delete user.dataValues.password;
      },
      beforeUpdate(user: User) {
        if (user.changed("password" as keyof User)) {
          user.dataValues.password = hashString(user.dataValues.password as string);
        }
      },
      beforeBulkUpdate(instance) {},
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
