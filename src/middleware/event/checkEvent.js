import models from '../../models/index';
import httpError from '../../helpers/errorsHandler/httpError';

const { Event } = models;

const checkEvent = async (req, res, next) => {
  const { slug } = req.params;
  const event = await Event.findOne({
    where: { slug }
  });
  if (!event || event.isDeleted === true) {
    throw new httpError(404, 'Event not found');
  } else {
    const { dataValues } = event;
    req.organizerEmail = dataValues.organizer;
    req.event = slug;
    req.eventObj = dataValues;
  }
  next();
};

export { checkEvent };
