import Joi from "joi";

const messageSchema = Joi.object({
  createdAt: Joi.date().required(),
  text: Joi.string().required(),
});

const conversationSchema = Joi.object({
  title: Joi.string().required(),
  user: Joi.string().required(),
});

const orderSchema = Joi.object({
  userDid: Joi.string().required(),
  pfiDid: Joi.string().required(),
  exchangeId: Joi.string().required(),
  status: Joi.string().required(),
  rating: Joi.number().min(1).max(5),
  review: Joi.string(),
});

const pairSchema = Joi.object({
  type: Joi.string().required(),
  offering: Joi.string().required(),
});

const pfiSchema = Joi.object({
  name: Joi.string().required(),
  did: Joi.string().required(),
  orders: Joi.array().items(orderSchema).default([]),
  pairs: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(true),
  creator: Joi.string().required(),
});

export {
  conversationSchema,
  messageSchema,
  orderSchema,
  pairSchema,
  pfiSchema,
};
