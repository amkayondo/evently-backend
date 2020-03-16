import express from 'express';
import Users from '../../controllers/users';
import {
  validateUser,
  validations,
  validateUserLogin,
  validatePassword,
  validateChangePassword
} from '../../middleware/validations/validateAll';
import {
  checkUser,
  checkUserLogin,
  checkPassword
} from '../../middleware/users/checkUser';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import authUser from '../../middleware/users/authUser';
import auth from '../../middleware/users/auth';

const users = new Users();

const router = express.Router();

router.post(
  '/',
  validateUser,
  asyncHandler(checkUser),
  validations,
  asyncHandler(users.signup)
);
router.post(
  '/login',
  validateUserLogin,
  asyncHandler(checkUserLogin),
  validations,
  asyncHandler(users.login)
);
router.put(
  '/reset-password',
  validatePassword,
  validations,
  asyncHandler(users.resetPassword)
);
router.get('/verify/:token', asyncHandler(users.activateAccount));
router.post('/check-user', validations, asyncHandler(users.checkUser));
router.post('/send-email', asyncHandler(users.checkEmail));
router.put(
  '/change-password',
  validateChangePassword,
  validations,
  auth,
  asyncHandler(checkPassword),
  asyncHandler(users.changeCurrentPassword)
);

router.patch('/location', auth, asyncHandler(users.updateLocation));
export default router;
