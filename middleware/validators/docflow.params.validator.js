const fs = require('fs/promises');
const { isValidObjectId } = require('mongoose');
const logger = require('../../libs/logger');

module.exports.title = async (ctx, next) => {
  if (!_checkTitle(ctx.request?.body?.title)) {
    ctx.throw(400, 'invalid title');
  }

  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!_checkObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid doc id');
  }

  await next();
};

module.exports.directingId = async (ctx, next) => {
  if (!_checkObjectId(ctx.request?.body?.directingId)) {
    ctx.throw(400, 'invalid directing id');
  }

  await next();
};

module.exports.taskId = async (ctx, next) => {
  if (!_checkObjectId(ctx.request?.body?.taskId)) {
    ctx.throw(400, 'invalid task id');
  }

  await next();
};

module.exports.authorId = async (ctx, next) => {
  if (!_checkObjectId(ctx.request?.body?.authorId)) {
    ctx.throw(400, 'invalid author id');
  }

  await next();
};

module.exports.scanCopy = async (ctx, next) => {
  _deleteFile(ctx.request.files || {});

  await next();
};

function _checkObjectId(id) {
  return isValidObjectId(id);
}

function _checkTitle(title) {
  return title?.trim();
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
