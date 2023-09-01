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

export const router = express.Router();

router.get('/', ctrlTask(listContacts));
router.get('/:contactId', validateId, ctrlTask(getContactById));
router.post('/', validateBody(schemas.addSchema), ctrlTask(addContact));
router.delete('/:contactId', validateId, ctrlTask(removeContact));
router.put('/:contactId', validateId, validateBody(schemas.addSchema), ctrlTask(updateContact));
router.patch(
  '/:contactId',
  validateId,
  validateBody(schemas.updateFavSchema),
  ctrlTask(updateFavorite)
);
