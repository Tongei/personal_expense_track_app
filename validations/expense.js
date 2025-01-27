import { validateObj } from "../utils/functions.js";
import Joi from 'joi'; 


export const vPostExpense = validateObj(
    Joi.object({
        amount : Joi.number().required(),
        category : Joi.string().required(),
        notes : Joi.string(),
        date : Joi.date().required()
    })
);

export const vPutExpense = validateObj(
    Joi.object({
        amount : Joi.number().required(),
        category : Joi.string().required(),
        notes : Joi.string(),
        date : Joi.date().required()
    })
);