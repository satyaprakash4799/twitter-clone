import express from 'express';

import { isUserAuthenticated } from '../middleware/authMidddleware';

const userProfileRoute = express.Router();

userProfileRoute.use(isUserAuthenticated);

export { userProfileRoute };