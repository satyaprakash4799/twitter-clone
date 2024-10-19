import Joi from "joi";
import {
  IReplyType,
  ISharedToType,
  IShareType,
} from "../../interface/tweetInterface";

const createTweetValidatorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "`userId` should be a string",
    "string.empty": "`userId` can't be empty.",
    "string.required": "`userId` is required.",
  }),
  parentId: Joi.string().uuid().optional().messages({
    "string.base": "`parentId` should be a string",
    "string.empty": "`parentId` can't be empty.",
  }),
  content: Joi.string().required().messages({
    "string.base": "`content` should be a string",
    "string.empty": "`content` can't be empty.",
    "string.required": "`content` is required.",
  }),
  sharedToType: Joi.string()
    .valid(...Object.values(ISharedToType))
    .required()
    .messages({
      "string.base": "`sharedToType` should be a string",
      "string.empty": "`sharedToType` can't be empty.",
      "string.required": "`sharedToType` is required.",
    }),
  replyType: Joi.string()
    .valid(...Object.values(IReplyType))
    .required()
    .messages({
      "string.base": "`replyType` should be a string",
      "string.empty": "`replyType` can't be empty.",
      "string.required": "`replyType` is required.",
    }),
  shareType: Joi.string()
    .valid(...Object.values(IShareType))
    .optional()
    .messages({
      "string.base": "`shareType` should be a string",
      "string.empty": "`shareType` can't be empty.",
      "string.required": "`shareType` is required.",
    }),
});

const getTweetByIdValidatorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "`userId` should be a string",
    "string.empty": "`userId` can't be empty.",
    "string.required": "`userId` is required.",
  }),
  tweetId: Joi.string().uuid().required().messages({
    "string.base": "`tweetId` should be a string",
    "string.empty": "`tweetId` can't be empty.",
    "string.required": "`userId` is required.",
  }),
});

const tweetIdValidatorSchema = Joi.object({
  tweetId: Joi.string().uuid().required().messages({
    "string.base": "`tweetId` should be a string",
    "string.empty": "`tweetId` can't be empty.",
    "string.required": "`tweetId` is required.",
  }),
});

const updateTweetValidatorSchema = Joi.object({
  sharedToType: Joi.string()
    .valid(...Object.values(ISharedToType))
    .required()
    .messages({
      "string.base": "`sharedToType` should be a string",
      "string.empty": "`sharedToType` can't be empty.",
      "string.required": "`sharedToType` is required.",
    }),
  replyType: Joi.string()
    .valid(...Object.values(IReplyType))
    .required()
    .messages({
      "string.base": "`replyType` should be a string",
      "string.empty": "`replyType` can't be empty.",
      "string.required": "`replyType` is required.",
    }),
  shareType: Joi.string()
    .valid(...Object.values(IShareType))
    .optional()
    .messages({
      "string.base": "`shareType` should be a string",
      "string.empty": "`shareType` can't be empty.",
      "string.required": "`shareType` is required.",
    }),
});

const tweetUserIdValidatorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    "string.base": "`userId` should be a string",
    "string.empty": "`userId` can't be empty.",
    "string.required": "`userId` is required.",
  }),
})

const getTweetByIdValidator = (tweetData: any) => {
  return getTweetByIdValidatorSchema.validate(tweetData);
};

const createTweetValidator = (tweetData: any) => {
  return createTweetValidatorSchema.validate(tweetData);
};

const tweetIdValidator = (tweetData: any) => {
  return tweetIdValidatorSchema.validate(tweetData);
};

const updateTweetValidator = ( tweetData: any) => {
  return updateTweetValidatorSchema.validate(tweetData);
}

const tweetUserIdValidator = (tweetData: any) => {
  return tweetUserIdValidatorSchema.validate(tweetData);
}

export { getTweetByIdValidator, createTweetValidator, tweetIdValidator, updateTweetValidator, tweetUserIdValidator };
