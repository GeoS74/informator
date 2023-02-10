const About = require('../models/About');
const mapper = require('../mappers/about.mapper');

module.exports.get = async (ctx) => {
  // const brand = await _getBrand(ctx.params.id);
  // if (!brand) {
  //   ctx.throw(404, 'brand not found');
  // }
  ctx.status = 200;
  // ctx.body = mapper(brand);
};

module.exports.getAll = async (ctx) => {
  // const brands = ctx.query?.title
  //   ? await _getSearchBrands(ctx.query?.title)
  //   : await _getAllBrands();
  ctx.status = 200;
  // ctx.body = brands.map((brand) => mapper(brand));
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
  // const brand = await _updateBrand(ctx.params.id, ctx.request.body.title);
  // if (!brand) {
  //   ctx.throw(404, 'brand not found');
  // }
  ctx.status = 200;
  // ctx.body = mapper(brand);
};

module.exports.delete = async (ctx) => {
  // const brand = await _deleteBrand(ctx.params.id);
  // if (!brand) {
  //   ctx.throw(404, 'brand not found');
  // }
  ctx.status = 200;
  // ctx.body = mapper(brand);
};
