const fs = require('fs/promises');
const sharp = require('sharp');

const logger = require('../libs/logger');

const User = require('../models/User');
const Role = require('../models/Role');
const Action = require('../models/Action');
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

module.exports.search = async (ctx) => {
  const data = await _makeFilterData(ctx.query);
  const users = await _searchUsers(data);

  ctx.status = 200;
  ctx.body = users.map((user) => mapper(user));
};

async function _searchUsers(data) {
  return User.find(data.filter)
    .sort({ _id: 1 })
    .limit(data.limit)
    .populate({
      path: 'roles',
      populate: [
        { path: 'directings.directing' },
        { path: 'directings.tasks.task' },
        { path: 'directings.tasks.actions' },
      ],
    });
}


const ACTIONS_FROZEN_LIST = new Map();
Action.find({}).then(res => res.map(e => ACTIONS_FROZEN_LIST.set(e.title, e.id)))

async function _makeRolesByDirectingAndTask(directingId, taskId, acceptor, recipient) {
  const act = [];
  if(acceptor === '1') {
    act.push(ACTIONS_FROZEN_LIST.get('Согласовать'));
  }
  if(recipient === '1') {
    act.push(ACTIONS_FROZEN_LIST.get('Ознакомиться'));
  }

    return Role.find({
      directings: {
        $elemMatch: {
          directing: directingId,
          tasks: {
            $elemMatch: {
              task: taskId,
              actions: {$in: act}
            }
          }
        }
      }
    })
      .then(res => res.map(e => e._id));
}

async function _makeFilterData({
  search, lastId, limit, user, acceptor, recipient, author, directingId, taskId,
}) {
  const filter = {};
  const optional = {};

  if(directingId && taskId) {
    const roles = await _makeRolesByDirectingAndTask(directingId, taskId, acceptor, recipient);
    if (roles.length) {
      filter.roles = { $in: roles }
    }
  }

  if (search) {
    filter.fullName = {
      $regex: new RegExp(`${search}`),
      $options: 'i',
    };
  }

  // if (user) {
  //   switch (acceptor) {
  //     case '0':
  //       filter.acceptor = { $elemMatch: { user, accept: false } };
  //       break;
  //     case '1':
  //       filter.acceptor = { $elemMatch: { user, accept: true } };
  //       break;
  //     case '2':
  //       filter.acceptor = { $elemMatch: { user } };
  //       break;
  //     default:
  //   }

  //   switch (recipient) {
  //     case '0':
  //       filter.recipient = { $elemMatch: { user, accept: false } };
  //       break;
  //     case '1':
  //       filter.recipient = { $elemMatch: { user, accept: true } };
  //       break;
  //     case '2':
  //       filter.recipient = { $elemMatch: { user } };
  //       break;
  //     default:
  //   }
  // }

  if (lastId) {
    filter._id = { $lt: lastId };
  }

  return { filter, optional, limit };
}

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

  // await fs.rename(ctx.photo.filepath, `./files/photo/${ctx.photo.newFilename}`);

  /* change size photo */
  await _processingPhoto(ctx.photo)
    .catch((error) => ctx.throw(400, `error resizing photo: ${error.message}`));

  _deleteFile(ctx.photo.filepath);

  await this.get(ctx);
};

function _getUser({ email }) {
  return User.findOne({ email })
    .populate({
      path: 'roles',
      populate: [
        { path: 'directings.directing' },
        { path: 'directings.tasks.task' },
        { path: 'directings.tasks.actions' },
      ],
    });
}

function _getAllUsers() {
  return User.find().sort({ _id: 1 })
    .populate({
      path: 'roles',
      populate: [
        { path: 'directings.directing' },
        { path: 'directings.tasks.task' },
        { path: 'directings.tasks.actions' },
      ],
    });
}

function __searchUsers(needle) {
  return User.find({
    fullName: {
      $regex: new RegExp(`${needle}`),
      $options: 'i',
    },
  })
    .sort({ _id: 1 })
    .populate({
      path: 'roles',
      populate: [
        { path: 'directings.directing' },
        { path: 'directings.tasks.task' },
        { path: 'directings.tasks.actions' },
      ],
    });
}

function _addUser({ email, name }) {
  return User.create({
    email,
    name,
  });
}

function _updateUser({ email, name }) {
  return User.findOneAndUpdate(
    { email },
    { name },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  )
    .populate({
      path: 'roles',
      populate: [
        { path: 'directings.directing' },
        { path: 'directings.tasks.task' },
        { path: 'directings.tasks.actions' },
      ],
    });
}

function _delUser({ email }) {
  return User.findOneAndDelete(
    { email },
  )
    .populate({
      path: 'roles',
      populate: [
        { path: 'directings.directing' },
        { path: 'directings.tasks.task' },
        { path: 'directings.tasks.actions' },
      ],
    });
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

function _processingPhoto({ filepath, newFilename }) {
  return sharp(filepath)
    .resize({
      width: 160,
      height: 160,
    })
    .toFile(`./files/photo/${newFilename}`);
}
