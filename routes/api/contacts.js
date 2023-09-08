import express from 'express';
import {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateFavorite,
  removeContact,
} from '../../controllers/contactsMongodb.js';
import { ctrlTask } from '../../assets/ctrlTask.js';
import { schemas } from '../../models/contacts.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { validateId } from '../../middlewares/validateId.js';
import { authenticate } from '../../middlewares/authenticate.js';

export const contactsRouter = express.Router();

contactsRouter.get('/', authenticate, ctrlTask(listContacts));
contactsRouter.get('/:contactId', authenticate, validateId, ctrlTask(getContactById));
contactsRouter.post('/', authenticate, validateBody(schemas.addSchema), ctrlTask(addContact));
contactsRouter.delete('/:contactId', authenticate, validateId, ctrlTask(removeContact));
contactsRouter.put(
  '/:contactId',
  authenticate,
  validateId,
  validateBody(schemas.updateContactSchema),
  ctrlTask(updateContact)
);
contactsRouter.patch(
  '/:contactId',
  authenticate,
  validateId,
  validateBody(schemas.updateFavSchema),
  ctrlTask(updateFavorite)
);
