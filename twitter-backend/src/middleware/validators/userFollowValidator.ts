import Joi from "joi";
import { IFEED_TYPE } from "../../interface/userFollowInterface";

const createUserFollowValidatorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "User id should be a string",
    "string.empty": "User id can't be empty.",
    "string.required": "User id is required.",
  }),
  followerUserId: Joi.string().uuid().required().invalid(Joi.ref('userId')).messages({
    "string.base": "Follower id should be a string",
    "string.empty": "Follower id can't be empty.",
    "string.required": "Follower id is required.",
    "string.invalid": "Follower id can't be same of userId"
  }),
  disableFeed: Joi.boolean().messages({
    "boolean.base": `"disableFeed should be a boolean value"`,
  }),
  feedType: Joi.string().valid(...Object.values(IFEED_TYPE)).required().messages({
    "any.base": `"feedType" should be a string.`,
    "string.required": `"feedType" is a required field`,
  }),
});

const getUserFollowValidatorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "User id should be a string",
    "string.empty": "User id can't be empty.",
    "string.required": "User id is required.",
    "string.guid": "followerId should be a valid guid."
  }),
  followerUserId: Joi.string().uuid().required().messages({
    "string.base": "followerUserId should be a string",
    "string.empty": "followerUserId can't be empty.",
    "string.required": "followerUserId is required.",
    "string.guid": "followerUserId should be a valid guid."
  }),
});

const updateUserFollowValidatorSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.base": "User id should be a string",
    "string.empty": "User id can't be empty.",
    "string.required": "User id is required.",
  }),
  disableFeed: Joi.boolean().optional().messages({
    "boolean.base": `"disableFeed should be a boolean value"`,
  }),
  feedType: Joi.string().optional().valid(...Object.values(IFEED_TYPE)).messages({
    "any.base": `"feedType" should be a string.`,
  }),
}).or("disableFeed", "feedType");

const deleteUserFollowValidatorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "User id should be a string",
    "string.empty": "User id can't be empty.",
    "string.required": "User id is required.",
    "string.guid": "user id should be a guid"
  }),
  followerUserId: Joi.string().uuid().required().messages({
    "string.base": "Follower id should be a string",
    "string.empty": "Follower id can't be empty.",
    "string.required": "Follower id is required.",
    "string.guid": "Follower user id should be a guid"
  }),
});

const createUserFollowValidator = (userFollowData: any) => {
  return createUserFollowValidatorSchema.validate(userFollowData);
};

const updateUserFollowValidator = (userFollowData: any) => {
  return updateUserFollowValidatorSchema.validate(userFollowData);
};

const deleteUserFollowValidator = (userFollowData: any) => {
  return deleteUserFollowValidatorSchema.validate(userFollowData);
};

const getUserFollowValidator = (userData: any) => {
  return getUserFollowValidatorSchema.validate(userData);
};
export {
  createUserFollowValidator,
  getUserFollowValidator,
  updateUserFollowValidator,
  deleteUserFollowValidator,
};
