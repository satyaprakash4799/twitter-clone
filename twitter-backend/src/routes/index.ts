import express from "express";

import { userRoute } from "./userRoute";
import { userProfileRoute } from "./userProfileRoute";

const router = express.Router();

router.use("/user",    userRoute);
router.use("/userProfile",     userProfileRoute);

export { router };
