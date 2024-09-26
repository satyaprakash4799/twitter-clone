import Joi from "joi";

const createUserValidatorSchema = Joi.object({
  firstName: Joi.string().min(5).max(20).required().messages({
    "string.base": "First Name should be a string.",
    "string.empty": `First Name can't be empty.`,
    "string.min": `First Name must be of at least 5 characters long.`,
    "string.max": "First Name must be at most 20 characters long",
    "any.required": "First Name is required.",
  }),
  lastName: Joi.string().min(5).max(20).required().messages({
    "string.base": "Last Name should be a string.",
    "string.empty": `Last Name can't be empty.`,
    "string.min": `Last Name must be of at least 5 characters long.`,
    "string.max": "Last Name must be at most 20 characters long",
    "any.required": "Last Name is required.",
  }),
  username: Joi.string().min(5).max(20).required().messages({
    "string.base": "Username should be a string.",
    "string.empty": `Username can't be empty.`,
    "string.min": `Username must be of at least 8 characters long.`,
    "string.max": "Username must be at most 20 characters long",
    "any.required": "Username is required.",
  }),
  email: Joi.string()
    .email()
    .min(10)
    .max(50)
    .required()
    .messages({
      "any.required": "Email is required.",
      "string.base": "Email should be a string",
      "string.empty": `Email can't be empty`,
      "string.min": "Email must be of at least 10 characters long.",
      "string.max": "Email must be of at most 50 characters long",
    }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.base": "Password should be a string.",
    "string.empty": `Password can't be empty.`,
    "string.min": `Password must be of at least 5 characters long.`,
    "string.max": "Password must be at most 20 characters long",
    "any.required": "Password is required.",
  }),
  phoneNumber: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .required()
    .messages({
      "number.base": "Phone Number should be a string.",
      "number.empty": `Phone Number can't be empty.`,
      "number.min": `Phone Number must be of 10 characters long.`,
      "number.max": "Phone Number must be of 10 characters long",
      "any.required": "Phone Number is required.",
    }),
});

const signInValidatorSchema = Joi.object({
  username: Joi.string().messages({
    "string.base": "Username should be a string.",
    "string.empty": `Username can't be empty.`,
  }),
  email: Joi.string()
    .email()
    .messages({
      "string.base": "Email should be a string",
      "string.empty": `Email can't be empty`,
      "string.min": "Email must be of at least 10 characters long.",
      "string.max": "Email must be of at most 50 characters long",
    }),
  password: Joi.string().required().messages({
    "string.base": "Password should be a string.",
    "string.empty": `Password can't be empty.`,
    "any.required": "Password is required.",
  }),
  phoneNumber: Joi.number()
    .integer()
    .min(10 ** 9)
    .max(10 ** 10 - 1)
    .messages({
      "number.base": "Phone Number should be a string.",
      "number.empty": `Phone Number can't be empty.`,
      "number.min": `Phone Number must be of 10 characters long.`,
      "number.max": "Phone Number must be of 10 characters long",
    }),
}).or('username', 'email', 'phoneNumber');

const createUserValidator = (userData: any) => {
  return createUserValidatorSchema.validate(userData, { abortEarly: false });
};

const signInValidator = (userData: any) => {
  return signInValidatorSchema.validate(userData, { abortEarly: false});
}

export { createUserValidator, signInValidator };
