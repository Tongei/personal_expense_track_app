import Joi from 'joi'; // Import Joi
import { validateObj } from '../utils/functions.js'; // Import validateObj with .js extension

// Export the vRegister function as a named export
export const vRegister = validateObj(
  Joi.object({
    username: Joi.string().min(1).required(),
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().required(),
  })
);

export const vLogin = validateObj(
  Joi.object({
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(8).required(),
  })
)