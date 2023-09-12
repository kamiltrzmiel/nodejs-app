import express from 'express';
import { ctrlTask } from '../../assets/ctrlTask.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { authenticate } from '../../middlewares/authenticate.js';
import {
  register,
  login,
  logout,
  getCurrent,
  updateUserSubscription,
} from '../../controllers/authenticationJwt.js';
import { schemas } from '../../models/user.js';

export const authRouter = express.Router();

authRouter.post('/signup', validateBody(schemas.registerSchema), ctrlTask(register));
authRouter.post('/login', validateBody(schemas.loginSchema), ctrlTask(login));
authRouter.get('/current', authenticate, ctrlTask(getCurrent));
authRouter.get('/logout', authenticate, ctrlTask(logout));
authRouter.patch(
  '/updatesubscription',
  authenticate,
  validateBody(schemas.updateSubscriptionSchema),
  ctrlTask(updateUserSubscription)
);
