import Joi from 'joi';


const userBlockValidatorSchema = Joi.object({
  blockedUserId: Joi.string().uuid().required().messages({
    "string.base": "'blockedUserId should be a string",
    "string.empty": "'blockedUserId can't be empty.",
    "string.required": "'blockedUserId is required.",
    "string.invalid": "'blockedUserId can't be same of userId"
  })
});

const userBlockValidator = (blockUserData: any)  => {
  return userBlockValidatorSchema.validate(blockUserData);
}

export { userBlockValidator };