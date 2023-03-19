const Role = require('../models/Role');
const mapper = require('../mappers/access.setting.mapper');

module.exports.get = async (ctx) => {
  const settings = await _getAccessSettings();

  ctx.status = 200;
  ctx.body = mapper(settings);
};

module.exports.add = async (ctx) => {
  await _saveAccessSettings(ctx.request.body);

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

async function _saveAccessSettings(roles) {
  // console.log('~~~~~~roles~~~~~~~~')
  // console.log(roles)

  for (const role in roles) {
    if ({}.hasOwnProperty.call(roles, role)) {
      const directings = _getDirectings(roles[role]);

      console.log('~~~~~~~directings~~~~~~~')
      // console.log(directings)
      directings.map(e => {
        console.log(e)

        console.log('----------actions-------------')
        e.tasks.map(t => {
          console.log(t)
        })
      })


      await Role.findByIdAndUpdate(
        role.substring(3),
        { directings },
      );
    }
  }
}

/*
в зависимости от того сколько чекбоксов на клиенте включено, 
сервер может получать следующие структуры:

~~~~~~направление активировано, задачи - нет~~~~~~~~
{
  id_role: { id_directing: [ 'on' ] }
}
~~~~~~направление активировано, задачи - тоже~~~~~~~~
{
  id_role: {
    id_directing: { '0': 'on', id_task: [Array] }
  }
}
*/


function _getDirectings(role) {
  const result = [];

  console.log('~~~~~~~~role~~~~~~~~')
  console.log(role)


  for (const idDirecting in role) {

    // console.log(role[idDirecting])

    // if (role[idDirecting]['0']) {
    if (Object.keys(role[idDirecting]).length > 1) {

      result.push({
        directing: idDirecting.substring(3),

        tasks: _getTasks(role[idDirecting])
      })
    }
  }
  return result;
}

function _getTasks(directing) {
   console.log('~~~directing~~~~~~')
  console.log(directing)
 

  const result = [];
  for (const idTask in directing) {


    

    if (idTask !== '0') {
      console.log(idTask);

      result.push({
        task: idTask.substring(3),

        // actions: []

        actions: Object.keys(directing[idTask])
          .filter((a) => (a !== '0'))
          .map((a) => a.substring(3)),
      })
    }
  }
  return result;
}


function ___getStructure(role) {
  const result = [];
  // console.log(role)
  // console.log('~~~~~~~~~~~~~~~~~~~~~')

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
