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

module.exports.author = async (ctx, next) => {
  if (!_checkTitle(ctx.request?.body?.author)) {
    ctx.throw(400, 'invalid doc author');
  }

  await next();
};

module.exports.scanCopy = async (ctx, next) => {
  if (Object.keys(ctx.request.files).indexOf('scans') === -1) {
    _deleteFile(ctx.request.files);
    ctx.scans = [];
    await next();
    return;
  }

  const files = Array.isArray(ctx.request.files.scans)
    ? ctx.request.files.scans : [ctx.request.files.scans];

  for (const file of files) {
    if (!_checkMimeType(file.mimetype)) {
      _deleteFile(ctx.request.files);
      ctx.throw(400, 'bad mime type');
      return;
    }
  }

  ctx.scans = files;

  await next();
};

module.exports.lastId = async (ctx, next) => {
  if (ctx.query.last) {
    if (!_checkObjectId(ctx.query.last)) {
      ctx.throw(400, 'invalid last id');
    }
  }

  await next();
};

module.exports.limit = async (ctx, next) => {
  if (ctx.query.limit) {
    if (!_checkObjectId(ctx.query.limit)) {
      ctx.throw(400, 'invalid last id');
    }
    ctx.query.limit = parseInt(ctx.query.limit, 10) || 25;
  }

  await next();
};

function _checkMimeType(mimeType) {
  if (/^image\/\w+/.test(mimeType)) {
    return true;
  }
  if (/^application\/pdf/.test(mimeType)) {
    return true;
  }
  if (/^application\/vnd\.\w+/.test(mimeType)) {
    return true;
  }
  if (/^application\/msword/.test(mimeType)) {
    return true;
  }
  return false;
}

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
