import { User } from "./UserModel";
import { DisabledToken } from "./DisabledTokenModel";
import { UserProfile } from "./UserProfileModel";
import { UserFollow } from "./UserFollowModel";
import { UserBlock } from "./UserBlockModel";

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
});

User.hasMany(UserBlock, {
  as: 'blockedUsers',
  foreignKey: 'userId'
});

UserBlock.belongsTo(User, {
  as: 'blockedBy',
  foreignKey: 'userId'
})
export { User, DisabledToken, UserProfile, UserFollow, UserBlock };
