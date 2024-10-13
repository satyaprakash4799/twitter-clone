import { User } from "./UserModel";
import { DisabledToken } from "./DisabledTokenModel";
import { UserProfile } from "./UserProfileModel";
import { UserFollow } from "./UserFollowModel";

User.hasMany(DisabledToken, {
  foreignKey: "userId",
  as: "disabledToken",
});

User.hasOne(UserProfile, {
  foreignKey: "userId",
  as: "userProfile",
});

User.hasMany(UserFollow, {
  as: 'followers',
  foreignKey: 'userId',
});

User.hasMany(UserFollow, {
  as: 'following',
  foreignKey: 'followerUserId'
})

export { User, DisabledToken, UserProfile, UserFollow };
