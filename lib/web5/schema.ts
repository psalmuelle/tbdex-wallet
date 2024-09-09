import Joi from "joi";

const messageSchema = Joi.object({
  createdAt: Joi.date().required(),
  text: Joi.string().required(),
});

const conversationSchema = Joi.object({
  title: Joi.string().required(),
  user: Joi.string().required(),
});

export { conversationSchema, messageSchema };
