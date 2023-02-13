module.exports.params = async (ctx, next) => {
  if (!_checkPosition(ctx.request?.body?.position)) {
    ctx.throw(400, 'invalid position');
  }

  if (!_checkPhoto(ctx.request?.body?.photo)) {
    ctx.throw(400, 'invalid photo');
  }

  ctx.user = {
    position: ctx.request?.body?.positionn || null,
    photo: ctx.request?.body?.photo || null,
    ...ctx.user,
  };

  await next();
};

function _checkPosition() {
  return true;
}

function _checkPhoto() {
  return true;
}
