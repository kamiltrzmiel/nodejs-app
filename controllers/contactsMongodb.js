import { Contact } from '../models/contacts.js';
import { errorRequest } from '../assets/errorMessages.js';

export const listContacts = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const response = await Contact.find({ owner });
    res.status(200).json({ message: 'All contacts list', response });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const response = await Contact.findById(contactId);

    if (!response.owner.equals(owner)) {
      throw errorRequest(403, 'Access denied');
    }
    if (!response) {
      throw errorRequest(404, 'Not found');
    }
    res.status(200).json({ message: 'Contact by id', response });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const addContact = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const response = await Contact.create({ ...req.body, owner });
    res.status(201).json({ message: 'Contact added', response });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const removeContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const response = await Contact.findByIdAndRemove(contactId);

    if (!response.owner.equals(owner)) {
      throw errorRequest(403, 'Access denied');
    }
    if (!response) {
      throw errorRequest(404, 'Not found');
    }
    res.status(200).json({
      message: 'Contact deleted',
      response,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const response = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!response.owner.equals(owner)) {
      throw errorRequest(403, 'Access denied');
    }
    if (!response) {
      throw errorRequest(404, 'Not found');
    }
    res.status(200).json({
      message: 'Contact updated',
      response,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const response = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

    if (!response.owner.equals(owner)) {
      throw errorRequest(403, 'Access denied');
    }
    if (!response) {
      throw errorRequest(404, 'Not found');
    }
    res.status(200).json({
      message: 'Favorite item updated',
      response,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
  }
};
