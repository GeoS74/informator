const fs = require('fs/promises');
const sharp = require('sharp');
const Doc = require('../models/Doc');
const mapper = require('../mappers/docflow.mapper');
const logger = require('../libs/logger');

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
  ctx.request.body.files = await _processingScans(ctx.scans);

  _deleteFile(ctx.scans);

  const doc = await _addDoc(ctx.request.body);

  ctx.status = 201;
  ctx.body = mapper(doc);
};

module.exports.update = async (ctx) => {
  ctx.request.body.files = await _processingScans(ctx.scans);

  _deleteFile(ctx.scans);

  const doc = await _updateDoc(ctx.params.id, ctx.request.body);

  if (!doc) {
    ctx.throw(404, 'doc not found');
  }
  ctx.status = 200;
  ctx.body = mapper(doc);
};

module.exports.delete = async (ctx) => {
  const doc = await _deleteDoc(ctx.params.id);

  /* delete scans */
  if (doc.files) {
    _deleteScans(doc.files);
  }

  if (!doc) {
    ctx.throw(404, 'doc not found');
  }
  ctx.status = 200;
  ctx.body = mapper(doc);
};

module.exports.deleteFile = async (ctx) => {
  let doc = await _getDoc(ctx.params.id);

  if (!doc) {
    ctx.throw(404, 'doc not found');
  }

  /* delete scans */
  _deleteScans([{ fileName: ctx.request.body.fileName }]);

  const files = doc.files.filter((f) => f.fileName !== ctx.request.body.fileName);

  doc = await _deleteFileToList(doc._id, files);

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
  title,
  description,
  directingId,
  taskId,
  author,
  files,
}) {
  return Doc.create({
    title,
    desc: description,
    directing: directingId,
    task: taskId,
    author,
    files,
  })
    .then((doc) => Doc.findById(doc._id)
      .populate('directing')
      .populate('task')
      .populate('author'));
}

function _updateDoc(id, {
  title,
  description,
  directingId,
  taskId,
  author,
  files,
}) {
  return Doc.findByIdAndUpdate(
    id,
    {
      title,
      desc: description,
      directing: directingId,
      task: taskId,
      author,
      $push: { files },
    },
    {
      new: true,
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

function _deleteFileToList(id, files) {
  return Doc.findByIdAndUpdate(
    id,
    { files },
    { new: true },
  )
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

function _deleteScans(files) {
  for (const file of files) {
    fs.unlink(`./files/scan/${file.fileName}`)
      .catch((error) => logger.error(error.mesasge));
  }
}

function _deleteFile(files) {
  for (const file of Object.values(files)) {
    // received more than 1 file in any field with the same name
    if (Array.isArray(file)) {
      _deleteFile(file);
    } else {
      fs.unlink(file.filepath)
        .catch((error) => logger.error(error.mesasge));
    }
  }
}

async function _processingScans(scans) {
  const res = [];
  for (const scan of scans) {
    await sharp(scan.filepath)
      // .resize({
      //   width: 160,
      //   height: 160,
      // })
      .toFile(`./files/scan/${scan.newFilename}`)
      .catch((error) => logger.error(`error processing scan: ${error.message}`));

    res.push({
      originalName: scan.originalFilename,
      fileName: scan.newFilename,
    });
  }
  return res;
}
