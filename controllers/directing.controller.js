const Directing = require('../models/Directing');
const mapper = require('../mappers/directing.mapper');

module.exports.get = async (ctx) => {
  const directing = await _getDirecting(ctx.params.id);

  if (!directing) {
    ctx.throw(404, 'directing not found');
  }
  ctx.status = 200;
  ctx.body = mapper(directing);
};

module.exports.getAll = async (ctx) => {
  const directings = ctx.query?.title
    ? await _searchDirecting(ctx.query.title)
    : await _getDirectingAll();

  ctx.status = 200;
  ctx.body = directings.map((directing) => (mapper(directing)));
};

module.exports.add = async (ctx) => {
  const directing = await _addDirecting(ctx.request.body.title);
  ctx.status = 201;
  ctx.body = mapper(directing);
};

module.exports.update = async (ctx) => {
  const directing = await _updateDirecting(ctx.params.id, ctx.request.body.title);

  if (!directing) {
    ctx.throw(404, 'directing not found');
  }
  ctx.status = 200;
  ctx.body = mapper(directing);
};

module.exports.delete = async (ctx) => {
  const directing = await _deleteDirecting(ctx.params.id);

  if (!directing) {
    ctx.throw(404, 'directing not found');
  }
  ctx.status = 200;
  ctx.body = mapper(directing);
};

function _getDirecting(id) {
  return Directing.findById(id);
}

function _getDirectingAll() {
  return Directing.find().sort({ _id: 1 });
}

function _addDirecting(title) {
  return Directing.create({ title });
}

function _updateDirecting(id, title) {
  return Directing.findByIdAndUpdate(
    id,
    { title },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );
}

function _deleteDirecting(id) {
  return Directing.findByIdAndDelete(id);
}

async function _searchDirecting(title) {
  const filter = {
    $text: {
      $search: title,
      $language: 'russian',
    },
  };

  const projection = {
    score: { $meta: 'textScore' }, // добавить в данные оценку текстового поиска (релевантность)
  };
  return Directing.find(filter, projection)
    .sort({
      _id: -1,
      //  score: { $meta: "textScore" } //сортировка по релевантности
    });
}
