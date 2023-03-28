const { isValidObjectId } = require('mongoose');

module.exports.title = async (ctx, next) => {
  if (!_checkTitle(ctx.request?.body?.title)) {
    ctx.throw(400, 'invalid title');
  }

  await next();
};

module.exports.objectId = async (ctx, next) => {
  if (!_checkObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid action id');
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

function _checkObjectId(id) {
  return isValidObjectId(id);
}

function _checkTitle(title) {
  return title?.trim();
}
