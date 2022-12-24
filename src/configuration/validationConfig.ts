// Core
import * as joi from 'joi';

export const eviromentValidation = joi.object({
  PORT: joi.number(),
});
