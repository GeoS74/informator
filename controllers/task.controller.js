const Task = require('../models/Task');
const mapper = require('../mappers/task.mapper');

module.exports.get = async (ctx) => {
  const task = await _getTask(ctx.params.id);

  if (!task) {
    ctx.throw(404, 'task not found');
  }
  ctx.status = 200;
  ctx.body = mapper(task);
};

module.exports.getAll = async (ctx) => {
  const tasks = ctx.query?.title
    ? await _searchTask(ctx.query.title)
    : await _getTaskAll();

  ctx.status = 200;
  ctx.body = tasks.map((task) => (mapper(task)));
};

module.exports.add = async (ctx) => {
  const task = await _addTask(ctx.request.body.title);
  ctx.status = 201;
  ctx.body = mapper(task);
};

module.exports.update = async (ctx) => {
  const task = await _updateTask(ctx.params.id, ctx.request.body.title);

  if (!task) {
    ctx.throw(404, 'task not found');
  }
  ctx.status = 200;
  ctx.body = mapper(task);
};

module.exports.delete = async (ctx) => {
  const task = await _deleteTask(ctx.params.id);

  if (!task) {
    ctx.throw(404, 'task not found');
  }
  ctx.status = 200;
  ctx.body = mapper(task);
};

function _getTask(id) {
  return Task.findById(id);
}

function _getTaskAll() {
  return Task.find().sort({ _id: 1 });
}

function _addTask(title) {
  return Task.create({ title });
}

function _updateTask(id, title) {
  return Task.findByIdAndUpdate(
    id,
    { title },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );
}

function _deleteTask(id) {
  return Task.findByIdAndDelete(id);
}

async function _searchTask(title) {
  const filter = {
    $text: {
      $search: title,
      $language: 'russian',
    },
  };

  const projection = {
    score: { $meta: 'textScore' }, // добавить в данные оценку текстового поиска (релевантность)
  };
  return Task.find(filter, projection)
    .sort({
      _id: -1,
      // score: { $meta: "textScore" } //сортировка по релевантности
    });
}
