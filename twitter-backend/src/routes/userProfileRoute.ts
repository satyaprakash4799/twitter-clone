import express from 'express';

import { isUserAuthenticated } from '../middleware/authMidddleware';
import { UserProfileController } from '../controllers/UserProfileController';

const userProfileRoute = express.Router();
const userProfileController = new UserProfileController;

userProfileRoute.use(isUserAuthenticated);

userProfileRoute.get('/', userProfileController.getUserProfile);
userProfileRoute.post('/', userProfileController.createUserProfile);
userProfileRoute.put('/', userProfileController.updateUserProfile);
userProfileRoute.delete('/', userProfileController.deleteUserProfile);


export { userProfileRoute };