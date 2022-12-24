// Core
import * as joi from 'joi';

export const eviromentValidation = joi.object({
  PORT: joi.number(),
  DATABASE_URL: joi.string(),
});
