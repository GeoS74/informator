const About = require('../models/About');
const mapper = require('../mappers/about.mapper');

module.exports.get = async (ctx) => {
  const about = await About.findOne({ alias: ctx.params.alias });
  if (!about) {
    ctx.throw(404, 'alias not found');
  }
  ctx.status = 200;
  ctx.body = mapper(about);
};

module.exports.getAll = async (ctx) => {
  const abouts = await About.find().sort({ _id: 1 });

  ctx.status = 200;
  ctx.body = abouts.map((about) => (mapper(about)));
};

module.exports.add = async (ctx) => {
  const about = await About.create({
    mdInfo: ctx.request.body.mdInfo,
    alias: ctx.request.body.alias,
  });
  ctx.status = 201;
  ctx.body = mapper(about);
};

module.exports.update = async (ctx) => {
  const about = await About.findOneAndUpdate(
    { alias: ctx.params.alias },
    { mdInfo: ctx.request.body.mdInfo.trim() },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );

  if (!about) {
    ctx.throw(404, 'alias page not found');
  }
  ctx.status = 200;
  ctx.body = mapper(about);
};

module.exports.delete = async (ctx) => {
  const about = await About.findOneAndDelete(
    { alias: ctx.params.alias },
  );

  if (!about) {
    ctx.throw(404, 'alias page not found');
  }

  ctx.status = 200;
  ctx.body = mapper(about);
};
