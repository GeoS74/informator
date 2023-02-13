const User = require('../models/User');
const mapper = require('../mappers/user.mapper');

module.exports.get = async (ctx) => {
  const user = await User.findOne({ email: ctx.user.email });
  if (!user) {
    ctx.throw(404, 'user not found');
  }
  ctx.status = 200;
  ctx.body = mapper(user);
};

module.exports.getAll = async (ctx) => {
  const users = await User.find().sort({ _id: 1 });

  ctx.status = 200;
  ctx.body = users.map((user) => mapper(user));
};

module.exports.add = async (ctx) => {
  const user = await User.create({
    email: ctx.user.email,
    rank: ctx.user.rank,
    position: ctx.user.position,
    photo: ctx.user.photo,
  });

  ctx.status = 201;
  ctx.body = mapper(user);
};

module.exports.update = async (ctx) => {
  const user = await User.findOneAndUpdate(
    { email: ctx.user.email },
    {
      position: ctx.user.position,
      photo: ctx.user.photo,
    },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );

  if (!user) {
    ctx.throw(404, 'user not found');
  }
  ctx.status = 200;
  ctx.body = mapper(user);
};

module.exports.delete = async (ctx) => {
  const user = await User.findOneAndDelete(
    { email: ctx.user.email },
  );

  if (!user) {
    ctx.throw(404, 'user not found');
  }

  ctx.status = 200;
  ctx.body = mapper(user);
};
