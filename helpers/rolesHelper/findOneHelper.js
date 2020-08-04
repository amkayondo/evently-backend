export default async (model, condition) => {
  const instance = await model.findOne({ where: condition });
  return instance;
};
