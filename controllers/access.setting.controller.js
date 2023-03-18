const Role = require('../models/Role');
const mapper = require('../mappers/access.setting.mapper');

module.exports.get = async (ctx) => {
  const settings = await _getAccessSettings();

  ctx.status = 200;
  ctx.body = mapper(settings);
};

module.exports.add = async (ctx) => {
  await _addRoleToTasks(ctx.request.body);

  ctx.status = 200;
  ctx.body = {
    message: 'saved access setting',
  };
};

async function _getAccessSettings() {
  return Role.find({})
    .populate('directings.directing')
    .populate('directings.tasks.task')
    .populate('directings.tasks.actions');
}

async function _addRoleToTasks(roles) {
  // console.log(roles)
  for (const role in roles) {
    if ({}.hasOwnProperty.call(roles, role)) {
      const tasks = _getIdActiveTasks(roles[role]);
      // console.log(tasks)

      await Role.findByIdAndUpdate(
        role.substring(3),
        { tasks },
      );
    }
  }
}

function _getIdActiveTasks(role) {
  const result = [];
  console.log(role)

  for (const idTask in role) {
    if (role[idTask]['0']) {
      result.push({
        task: idTask.substring(3),

        actions: Object.keys(role[idTask])
          .filter((a) => (a !== '0'))
          .map((a) => a.substring(3)),
      });
    }
  }
  return result;
}
