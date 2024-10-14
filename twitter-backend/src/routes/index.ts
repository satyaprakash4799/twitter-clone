import express from "express";

import { userRoute } from "./userRoute";
import { userProfileRoute } from "./userProfileRoute";
import { userFollowRoute } from "./userFollowRoute";
import { userBlockRoute } from "./userBlockRoute";

const router = express.Router();

router.use("/user", userRoute);
router.use("/profile", userProfileRoute);
router.use("/follow", userFollowRoute);
router.use("/block", userBlockRoute);

export { router };
