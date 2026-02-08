const Joi = require("joi");

exports.createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    address: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional()
  }).optional(),
  paymentMethod: Joi.string().allow("").optional()
});

exports.statusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "processing", "shipped", "delivered", "cancelled")
    .required()
});
