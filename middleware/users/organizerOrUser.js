import authHelper from '../../helpers/authHelper';
import authStrategy from '../../helpers/authStrategy';

export default async (req, res, next) => {
  const email = await authHelper(req);
  const condition2 = { email };
  const condition = [{ designation: 'ORGANIZER' }, { designation: 'USER' }];
  const user = await authStrategy(condition, condition2);

  const { dataValues } = user;
  req.user = dataValues;
  next();
};
