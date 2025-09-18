import * as Joi from 'joi';

/**
 * @description - Esquema de validación Joi para las variables de entorno
 */
export const joiValidationSchema = Joi.object({
	MONGO_URL: Joi.required(),
	PORT: Joi.number().default(3000),
	DEFAULT_LIMIT: Joi.number().default(5),
});

