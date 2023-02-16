const fs = require('fs/promises');
// const sharp = require('sharp');

const logger = require('../libs/logger');

const User = require('../models/User');
const mapper = require('../mappers/user.mapper');

module.exports.get = async (ctx) => {
  const user = await _getUser(ctx.user);
  if (!user) {
    ctx.throw(404, 'user not found');
  }

  ctx.status = 200;
  ctx.body = mapper(user);
};

module.exports.getAll = async (ctx) => {
  const users = await _getAllUsers();

  ctx.status = 200;
  ctx.body = users.map((user) => mapper(user));
};

module.exports.add = async (ctx) => {
  const user = await _addUser(ctx.user);

  ctx.status = 201;
  ctx.body = mapper(user);
};

module.exports.update = async (ctx) => {
  const user = await _updateUser(ctx.user);
  if (!user) {
    ctx.throw(404, 'user not found');
  }

  ctx.status = 200;
  ctx.body = mapper(user);
};

module.exports.delete = async (ctx) => {
  const user = await _delUser(ctx.user);
  if (!user) {
    ctx.throw(404, 'user not found');
  }

  /* delete photo */
  if (user?.photo) {
    _deleteFile(`./files/photo/${user.photo}`);
  }

  ctx.status = 200;
  ctx.body = mapper(user);
};

module.exports.photo = async (ctx) => {
  const user = await _updatePhoto(ctx.user.email, ctx.photo.newFilename);

  if (!user) {
    _deleteFile(ctx.photo.filepath);
    ctx.throw(404, 'user not found');
  }

  /* delete old photo */
  if (user?.photo) {
    _deleteFile(`./files/photo/${user.photo}`);
  }

  await fs.rename(ctx.photo.filepath, `./files/photo/${ctx.photo.newFilename}`);

  /* change size photo */
  // await _processingPhoto(ctx.photo)
  //   .catch((error) => ctx.throw(400, error.message));

  _deleteFile(ctx.photo.filepath);

  await this.get(ctx);
};

function _getUser({ email }) {
  return User.findOne({ email });
}

function _getAllUsers() {
  return User.find().sort({ _id: 1 });
}

function _addUser({ email, position }) {
  return User.create({
    email,
    position,
  });
}

function _updateUser({ email, position }) {
  return User.findOneAndUpdate(
    { email },
    { position },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );
}

function _delUser({ email }) {
  return User.findOneAndDelete(
    { email },
  );
}

function _updatePhoto(email, photo) {
  return User.findOneAndUpdate(
    { email },
    { photo },
    {
      new: false,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );
}

function _deleteFile(fpath) {
  fs.unlink(fpath)
    .catch((error) => logger.error(`delete file: ${error.message}`));
}

// function _processingPhoto({ filepath, newFilename }) {
//   return sharp(filepath)
//     .resize({
//       width: 160,
//       height: 160,
//     })
//     .toFile(`./files/photo/${newFilename}`);
// }
