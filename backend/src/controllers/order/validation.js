const Joi = require('joi');

const OrderSchema = Joi.object({
    address: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
});

module.exports = {OrderSchema};