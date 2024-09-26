import { User } from "./UserModel";
import { DisabledToken } from "./DisabledTokenModel";


User.hasMany(DisabledToken, {
  foreignKey: 'userId',
  as: 'disabledToken'
});


export { User, DisabledToken};
