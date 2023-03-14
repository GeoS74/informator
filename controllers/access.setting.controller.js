const Action = require('../models/Action');
const mapper = require('../mappers/action.mapper');
const Role = require('../models/Role')

// module.exports.get = async (ctx) => {
//   const action = await _getAction(ctx.params.id);

//   if (!action) {
//     ctx.throw(404, 'action not found');
//   }
//   ctx.status = 200;
//   ctx.body = mapper(action);
// };

// module.exports.getAll = async (ctx) => {
//   const actions = ctx.query?.title
//     ? await _searchAction(ctx.query.title)
//     : await _getActionAll();

//   ctx.status = 200;
//   ctx.body = actions.map((action) => (mapper(action)));
// };

module.exports.add = async (ctx) => {
  await _addRoleToTasks(ctx.request.body)
  await _show();

  ctx.body = 'ok';

  // const action = await _addAction(ctx.request.body);
  ctx.status = 201;
  // ctx.body = mapper(action);
};

async function _show() {
  const foo = await Role.find({}).populate('tasks.task').populate('tasks.actions')
  // .populate('actions')

  // console.log(foo)

  foo.map(e => {
    console.log(e);
    console.log('!!!!!!!!!!!!!!!!')
    // console.log(e.tasks)

    e.tasks.map(console.log)

    console.log('............')
  })
}


async function _addRoleToTasks(roles) {
  // console.log(roles);
  // console.log('--------------------');

  for (let role in roles) {
    // const tasks = Object.keys(roles[role]).map(e => e.substring(3));
    const tasks = _getIdActiveTasks(roles[role]);

    // console.log(tasks);
    const foo = await Role.findByIdAndUpdate(
      role.substring(3),
      { tasks: tasks }
    )

    // console.log(foo)
    // for(let task in role) {
    // }
  }
}

function _getIdActiveTasks(role) {
  const result = [];

  for(let id_task in role) {
    if(role[id_task]['0']) {
      result.push({
        task: id_task.substring(3),

        actions: Object.keys(role[id_task])
        .filter(a => (a === '0') ? false : true)
        .map(a => a.substring(3)),

        // test: 
      })
    }
  }
  // console.log(role)
  return result;
}






// module.exports.update = async (ctx) => {
//   const action = await _updateAction(ctx.params.id, ctx.request.body.title);

//   if (!action) {
//     ctx.throw(404, 'action not found');
//   }
//   ctx.status = 200;
//   ctx.body = mapper(action);
// };

// module.exports.delete = async (ctx) => {
//   const action = await _deleteAction(ctx.params.id);

//   if (!action) {
//     ctx.throw(404, 'action not found');
//   }
//   ctx.status = 200;
//   ctx.body = mapper(action);
// };

// function _getAction(id) {
//   return Action.findById(id);
// }

// function _getActionAll() {
//   return Action.find().sort({ _id: 1 });
// }

function _addAction(roles) {
  // return roles.;
}

// function _updateAction(id, title) {
//   return Action.findByIdAndUpdate(
//     id,
//     { title },
//     {
//       new: true,
//       runValidators: true, // запускает валидаторы схемы перед записью
//     },
//   );
// }

// function _deleteAction(id) {
//   return Action.findByIdAndDelete(id);
// }

// async function _searchAction(title) {
//   const filter = {
//     $text: {
//       $search: title,
//       $language: 'russian',
//     },
//   };

//   const projection = {
//     score: { $meta: 'textScore' }, // добавить в данные оценку текстового поиска (релевантность)
//   };
//   return Action.find(filter, projection)
//     .sort({
//       _id: -1,
//       //  score: { $meta: "textScore" } //сортировка по релевантности
//     });
// }
