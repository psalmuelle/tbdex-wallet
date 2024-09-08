import Joi from "joi";

const messageSchema = Joi.object({
  _id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  createdAt: Joi.date().required(),
  text: Joi.string().required(),
});

const conversationSchema = Joi.object({
  _id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  createdAt: Joi.date().required(),
  messages: Joi.array().items(messageSchema).default([]),
  user: Joi.string().required(),
});

const orderSchema = Joi.object({
  _id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  userDid: Joi.string().required(),
  pfiDid: Joi.string().required(),
  exchangeId: Joi.string().required(),
  status: Joi.string().required(),
  rating: Joi.number().min(1).max(5),
  review: Joi.string(),
});

const pairSchema = Joi.object({
  _id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  type: Joi.string().required(),
  offering: Joi.string().required(),
});

const pfiSchema = Joi.object({
  _id: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
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
