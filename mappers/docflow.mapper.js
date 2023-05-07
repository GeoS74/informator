module.exports = (data) => ({
  id: data.id,
  num: data.num,
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
    uid: data.author._id,
    fullName: data.author.fullName,
  },
  files: data.files.map((f) => ({
    originalName: f.originalName,
    fileName: f.fileName,
  })),

  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
