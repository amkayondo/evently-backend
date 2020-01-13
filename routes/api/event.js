import express from 'express';
import {createEventController} from '../../controller/event'
import {validateEvent, validations} from '../../middleware/validations/validateAll'
const router = express.Router();

router.post(
  '/event',
  validateEvent,
  validations,
  createEventController
);

export default router;