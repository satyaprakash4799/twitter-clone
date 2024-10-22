import express from 'express';

import { isUserAuthenticated } from '../middleware/authMidddleware';
import { UserFollowController } from '../controllers/UserFollowController';

const userFollowRoute = express.Router();
const userFollowController = new UserFollowController;

userFollowRoute.use(isUserAuthenticated);

userFollowRoute.post('/follow', userFollowController.addUserFollow);
userFollowRoute.get('/:userId/followers/', userFollowController.getFollowers);
userFollowRoute.get('/:userId/followings', userFollowController.getFollowings);
// userFollowRoute.put('/follower/:targetUserId', userFollowController.updateFollower);
userFollowRoute.delete('/:targetUserId', userFollowController.deleteFollower);

export { userFollowRoute };