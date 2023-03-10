const Action = require('../models/Action');
const mapper = require('../mappers/action.mapper');

module.exports.get = async (ctx) => {
  const action = await _getAction(ctx.params.id);

  if (!action) {
    ctx.throw(404, 'action not found');
  }
  ctx.status = 200;
  ctx.body = mapper(action);
};

module.exports.getAll = async (ctx) => {
  const actions = ctx.query?.title
    ? await _searchAction(ctx.query.title)
    : await _getActionAll();

  ctx.status = 200;
  ctx.body = actions.map((action) => (mapper(action)));
};

module.exports.add = async (ctx) => {
  const action = await _addAction(ctx.request.body.title);
  ctx.status = 201;
  ctx.body = mapper(action);
};

module.exports.update = async (ctx) => {
  const action = await _updateAction(ctx.params.id, ctx.request.body.title);

  if (!action) {
    ctx.throw(404, 'action not found');
  }
  ctx.status = 200;
  ctx.body = mapper(action);
};

module.exports.delete = async (ctx) => {
  const action = await _deleteAction(ctx.params.id);

  if (!action) {
    ctx.throw(404, 'action not found');
  }
  ctx.status = 200;
  ctx.body = mapper(action);
};

function _getAction(id) {
  return Action.findById(id);
}

function _getActionAll() {
  return Action.find().sort({ _id: 1 });
}

function _addAction(title) {
  return Action.create({ title });
}

function _updateAction(id, title) {
  return Action.findByIdAndUpdate(
    id,
    { title },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );
}

function _deleteAction(id) {
  return Action.findByIdAndDelete(id);
}

async function _searchAction(title) {
  const filter = {
    $text: {
      $search: title,
      $language: 'russian',
    },
  };

  const projection = {
    score: { $meta: 'textScore' }, // добавить в данные оценку текстового поиска (релевантность)
  };
  return Action.find(filter, projection)
    .sort({
      _id: -1,
      //  score: { $meta: "textScore" } //сортировка по релевантности
    });
}
