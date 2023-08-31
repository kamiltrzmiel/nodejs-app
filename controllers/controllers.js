import { Contact } from '../models/contacts.js';
import { errorRequest } from '../assets/errorMessages.js';

export const listContacts = async (req, res) => {
  const response = await Contact.find({});
  res.json({ message: 'All contacts list', response });
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  const response = await Contact.findById(contactId);
  if (!response) {
    throw errorRequest(404, 'Not found');
  }
  res.json({ message: 'Contact by id', response });
};

export const addContact = async (req, res) => {
  const response = await Contact.create(req.body);
  res.status(201).json({ message: 'Contact added', response });
};

export const removeContact = async (req, res) => {
  const { contactId } = req.params;
  const response = await Contact.findByIdAndRemove(contactId);
  if (!response) {
    throw errorRequest(404, 'Not found');
  }
  res.json({
    message: 'Contact deleted',
    response,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const response = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!response) {
    throw errorRequest(404, 'Not found');
  }
  res.json({
    message: 'Contact updated',
    response,
  });
};

export const updateFavorite = async (req, res) => {
  const { contactId } = req.params;
  const response = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!response) {
    throw errorRequest(404, 'Not found');
  }
  res.json({
    message: 'Favorite item updated',
    response,
  });
};
