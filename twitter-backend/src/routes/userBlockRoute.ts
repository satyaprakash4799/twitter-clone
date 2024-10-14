import express from 'express';

import { isUserAuthenticated } from '../middleware/authMidddleware';
import { UserBlockController } from '../controllers/UserBlockController';


const userBlockRoute = express.Router();
const userBlockController = new UserBlockController();

userBlockRoute.use(isUserAuthenticated);

userBlockRoute.get('/:blockedUserId', userBlockController.getBlockedUser );
userBlockRoute.post('/:blockedUserId', userBlockController.addBlockUser);
userBlockRoute.delete('/:blockedUserId', userBlockController.removeBlockedUser);
userBlockRoute.get('/list', userBlockController.blockedUsers);


export { userBlockRoute };