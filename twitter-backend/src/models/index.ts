import { User } from "./UserModel";
import { DisabledToken } from "./DisabledTokenModel";
import { UserProfile } from "./UserProfileModel";


User.hasMany(DisabledToken, {
  foreignKey: 'userId',
  as: 'disabledToken'
});
User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'userProfile'
})

export { User, DisabledToken, UserProfile};
