import Joi from "joi";

const createUserProfileValidatorSchema = Joi.object({
  address: Joi.string().optional().min(10).max(30).messages({
    "string.base": "Address should be a string.",
    "string.min": `Address must be of at least 10 characters long.`,
    "string.max": "Address must be at most 30 characters long",
  }),
  userImage: Joi.string().optional().messages({
    "string.base": "User image should be a string.",
  }),
  userId: Joi.string().required().messages({
    "string.base": "User id should be a string.",
    "string.empty": `User id can't be empty.`,
    "string.required": "User id is required.",
  }),
});

const updateUserProfileValidatorSchema = Joi.object({
  address: Joi.string().optional().min(10).max(30).messages({
    "string.base": "Address should be a string.",
    "string.min": `Address must be of at least 10 characters long.`,
    "string.max": "Address must be at most 30 characters long",
  }),
  userImage: Joi.string().optional().messages({
    "string.base": "User image should be a string.",
  })
});

const profileImageSchema = Joi.object({
  mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
});
const createUserProfileValidator = (userData: any) => {
  return createUserProfileValidatorSchema.validate(userData);
};

const updateUserProfileValidator = (userData: any) => {
  return updateUserProfileValidatorSchema.validate(userData);
}

const profileImageTypeValidator = (mimetype: object) => {
  return profileImageSchema.validate(mimetype);
}

export { createUserProfileValidator, updateUserProfileValidator, profileImageTypeValidator };
