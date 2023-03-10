module.exports.params = async (ctx, next) => {
  if (!_checkTitle(ctx.request?.body?.title)) {
    ctx.throw(400, 'invalid role title');
  }

  await next();
};

function _checkTitle(title) {
  return title?.trim();
}
