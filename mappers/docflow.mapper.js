module.exports = (data) => ({
  id: data.id,
  title: data.title,
  description: data.desc,
  directing: {
    id: data.directing._id,
    title: data.directing.title,
  },
  task: {
    id: data.task._id,
    title: data.task.title,
  },
  author: {
    id: data.author._id,
    title: data.author.email,
  },
  files: [],

  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
