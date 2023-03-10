const Role = require('../models/Role');
const mapper = require('../mappers/role.mapper');

module.exports.get = async (ctx) => {
  const role = await _getRole(ctx.params.id);

  if (!role) {
    ctx.throw(404, 'role not found');
  }
  ctx.status = 200;
  ctx.body = mapper(role);
};

module.exports.getAll = async (ctx) => {
  const roles = await _getRoleAll();

  ctx.status = 200;
  ctx.body = roles.map((role) => (mapper(role)));
};

module.exports.add = async (ctx) => {
  const role = await _addRole(ctx.request.body.title);
  ctx.status = 201;
  ctx.body = mapper(role);
};

module.exports.update = async (ctx) => {
  const role = await _updateRole(ctx.params.id, ctx.request.body.title);

  if (!role) {
    ctx.throw(404, 'role not found');
  }
  ctx.status = 200;
  ctx.body = mapper(role);
};

module.exports.delete = async (ctx) => {
  const role = await _deleteRole(ctx.params.id);

  if (!role) {
    ctx.throw(404, 'role not found');
  }
  ctx.status = 200;
  ctx.body = mapper(role);
};

function _getRole(id) {
  return Role.findById(id);
}

function _getRoleAll() {
  return Role.find().sort({ _id: 1 });
}

function _addRole(title) {
  return Role.create({ title });
}

function _updateRole(id, title) {
  return Role.findByIdAndUpdate(
    id,
    { title },
    {
      new: true,
      runValidators: true, // запускает валидаторы схемы перед записью
    },
  );
}

function _deleteRole(id) {
  return Role.findByIdAndDelete(id);
}
