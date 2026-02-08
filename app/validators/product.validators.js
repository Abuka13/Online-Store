const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  description: Joi.string().allow("").optional(),
  price: Joi.number().min(0).required(),
  category: Joi.string().allow("").optional(),
  image: Joi.string().allow("").optional()
});
