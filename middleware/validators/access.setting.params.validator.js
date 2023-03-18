const { isValidObjectId } = require('mongoose');

module.exports.objectId = async (ctx, next) => {
  if (!_checkObjectId(ctx.params.id)) {
    ctx.throw(400, 'invalid action id');
  }

  await next();
};

function _checkObjectId(id) {
  return isValidObjectId(id);
}
