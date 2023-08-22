import express from 'express';
import Joi from 'joi';
import { errorRequest } from './../../assets/errorMessages.js';
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} from './../../models/contacts.js';

export const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
  try {
    const response = await listContacts();
    res.json({ message: 'All contacts list', response });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const response = await getContactById(contactId);
    console.log(response);
    if (!response) {
      throw errorRequest(404);
    }
    res.json({ message: 'Contact by id', response });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw errorRequest(400, 'missing req name field');
    }
    const response = await addContact(req.body);
    res.status(201).json({ message: 'Contact added', response });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const response = await removeContact(contactId);
    if (!response) {
      throw errorRequest(404, 'not found');
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw errorRequest(400, 'Missing fields');
    }
    const { contactId } = req.params;
    const response = await updateContact(contactId, req.body);
    if (!response) {
      throw errorRequest(404);
    }
    res.json({ message: 'Contact updated', response });
  } catch (error) {
    next(error);
  }
});
