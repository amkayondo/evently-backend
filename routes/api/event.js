import express from 'express';
import multer from 'multer'
import { createEventController } from '../../controllers/event';
import asyncHandler from '../../helpers/errorsHandler/asyncHandler';
import {
  validateEvent,
  validations
} from '../../middleware/validations/validateAll';
import authUser from '../../middleware/users/authUser';
const router = express.Router();
const upload = multer();

router.post(
  '/event',
  upload.single('eventImage'),
  asyncHandler(authUser),
  validateEvent,
  validations,
  asyncHandler(createEventController)
);

export default router;