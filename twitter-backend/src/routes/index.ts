import express from "express";

import { userRoute } from "./userRoute";
import { userProfileRoute } from "./userProfileRoute";
import { userFollowRoute } from "./userFollowRoute";

const router = express.Router();

router.use("/user", userRoute);
router.use("/user-profile", userProfileRoute);
router.use("/user-follow", userFollowRoute);

export { router };
