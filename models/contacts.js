import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleDbErrors } from '../assets/handleDbErrors.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    email: {
      type: String,
      required: [true, 'E-mail is required!'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required!'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

contactSchema.post('save', handleDbErrors);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const Contact = model('contact', contactSchema);

const updateFavSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const schemas = {
  addSchema,
  updateFavSchema,
};
