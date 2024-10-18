import { User } from "./UserModel";
import { DisabledToken } from "./DisabledTokenModel";
import { UserProfile } from "./UserProfileModel";
import { UserFollow } from "./UserFollowModel";
import { UserBlock } from "./UserBlockModel";
import { Tweet } from "./TweetModel";

User.hasMany(DisabledToken, {
  foreignKey: "userId",
  as: "disabledToken",
});

User.hasOne(UserProfile, {
  foreignKey: "userId",
  as: "userProfile",
});

UserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

User.hasMany(UserFollow, {
  as: 'followers',
  foreignKey: 'userId',
});

User.hasMany(UserFollow, {
  as: 'followings',
  foreignKey: 'followerUserId'
});

User.hasMany(UserBlock, {
  as: 'blockedUsers',
  foreignKey: 'userId'
});

UserBlock.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId'
});

User.hasMany(Tweet, {
  as: 'tweets',
  foreignKey: 'userId'
});

Tweet.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId'
})

export { User, DisabledToken, UserProfile, UserFollow, UserBlock, Tweet };