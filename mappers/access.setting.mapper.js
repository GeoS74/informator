module.exports = (data) => data.map((role) => ({
  id: role._id,
  title: role.title,

  // directings: role.directings.map(d => ({
  //   id: d.directing._id,
  //   title: t.task.title,

  //   tasks: role.tasks.map((t) => ({
  //     id: t.task._id,
  //     title: t.task.title,
  //     actions: t.actions.map((action) => ({
  //       id: action._id,
  //       title: action.title,
  //     })),
  //   })),
  // }))
}));
