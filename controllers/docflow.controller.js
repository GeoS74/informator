const Doc = require('../models/Doc');
const mapper = require('../mappers/docflow.mapper');

module.exports.get = async (ctx) => {
  const doc = await _getDoc(ctx.params.id);

  if (!doc) {
    ctx.throw(404, 'doc not found');
  }
  ctx.status = 200;
  ctx.body = mapper(doc);
};

module.exports.getAll = async (ctx) => {
  const docs = ctx.query?.title
    ? await _searchDoc(ctx.query.title)
    : await _getDocAll();

  ctx.status = 200;
  ctx.body = docs.map((doc) => (mapper(doc)));
};

module.exports.add = async (ctx) => {
  const doc = await _addDoc(ctx.request.body);
  ctx.status = 201;
  ctx.body = mapper(doc);
};

module.exports.update = async (ctx) => {
  const doc = await _updateDoc(ctx.params.id, ctx.request.body);

  if (!doc) {
    ctx.throw(404, 'doc not found');
  }
  ctx.status = 200;
  ctx.body = mapper(doc);
};

module.exports.delete = async (ctx) => {
  const doc = await _deleteDoc(ctx.params.id);

  if (!doc) {
    ctx.throw(404, 'doc not found');
  }
  ctx.status = 200;
  ctx.body = mapper(doc);
};

function _getDoc(id) {
  return Doc.findById(id)
    .populate('directing')
    .populate('task')
    .populate('author');
}

function _getDocAll() {
  return Doc.find().sort({ _id: 1 })
    .populate('directing')
    .populate('task')
    .populate('author');
}

function _addDoc({
  title, description, directingId, taskId, author,
}) {
  return Doc.create({
    title,
    desc: description,
    directing: directingId,
    task: taskId,
    author: author,
  })
    .then((doc) => Doc.findById(doc._id)
      .populate('directing')
      .populate('task')
      .populate('author'));
}

function _updateDoc(id, {
  title, description, directingId, taskId, author,
}) {
  return Doc.findByIdAndUpdate(
    id,
    {
      title,
      desc: description,
      directing: directingId,
      task: taskId,
      author: author,
    },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  )
    .populate('directing')
    .populate('task')
    .populate('author');
}

function _deleteDoc(id) {
  return Doc.findByIdAndDelete(id)
    .populate('directing')
    .populate('task')
    .populate('author');
}

async function _searchDoc(title) {
  const filter = {
    $text: {
      $search: title,
      $language: 'russian',
    },
  };

  const projection = {
    score: { $meta: 'textScore' }, // добавить в данные оценку текстового поиска (релевантность)
  };
  return Doc.find(filter, projection)
    .sort({
      _id: -1,
      //  score: { $meta: "textScore" } //сортировка по релевантности
    })
    .populate('directing')
    .populate('task')
    .populate('author');
}