import express from 'express';
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updatedStatusContact,
} from './../../models/contacts.js';

export const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const response = await listContacts();
    res.json({ message: 'All contacts list', response });
  } catch (error) {
    res.status(500).json('error - db get contact list');
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const response = await getContactById(contactId);
    return res.json({ message: 'Contact by id', response });
  } catch (error) {
    res.status(500).json('error - db get contact by id');
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { body } = req;
  if (Object.keys(body).length === 0) {
    return res.status(400).json('error - db add contact - missing fields');
  }
  try {
    const response = await addContact(body);
    return res.status(201).json({ message: 'Contact added', response });
  } catch (error) {
    res.status(500).json('error - db add contact');
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const response = await removeContact(contactId);
    return res.status(200).json({ message: 'Contact deleted', response });
  } catch (error) {
    res.status(500).json('error - db remove contact');
    next(error);
  }
});

router.put('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  if (Object.keys(body).lenght === 0) {
    return res.status(400).json('error - db add contact - missing fields');
  }
  try {
    const response = await updateContact(contactId, body);
    return res.json({ message: 'Contact updated', response });
  } catch (error) {
    res.status(500).json('error - db update contact');
    next(error);
  }
});

router.patch('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const { favorite } = body;

  if (!('favorite' in body) || Object.keys(body).lenght === 0) {
    return res.status(400).json('error - db update favorite');
  }
  try {
    const response = await updatedStatusContact(contactId, favorite);
    return res.json({ message: 'Favorite updated', response });
  } catch (error) {
    res.status(500).json('error - db update favorite');
  }
});
