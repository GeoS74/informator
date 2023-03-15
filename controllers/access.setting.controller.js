const Role = require('../models/Role')
const mapper = require('../mappers/access.setting.mapper');

module.exports.get = async (ctx) => {
  const settings = await _getAccessSettings();

  ctx.status = 200;
  ctx.body = mapper(settings)
};

module.exports.add = async (ctx) => {
  await _addRoleToTasks(ctx.request.body)

  ctx.status = 200;
  ctx.body = {
    message: 'saved access setting'
  };
};

async function _getAccessSettings() {
  return Role.find({})
    .populate('tasks.task')
    .populate('tasks.actions');
}


async function _addRoleToTasks(roles) {


  for (let role in roles) {
    const tasks = _getIdActiveTasks(roles[role]);

    await Role.findByIdAndUpdate(
      role.substring(3),
      { tasks: tasks }
    )
  }
}

function _getIdActiveTasks(role) {
  const result = [];

  for (let id_task in role) {
    if (role[id_task]['0']) {
      result.push({
        task: id_task.substring(3),

        actions: Object.keys(role[id_task])
          .filter(a => (a === '0') ? false : true)
          .map(a => a.substring(3)),
      })
    }
  }
  return result;
}


