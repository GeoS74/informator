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
  author: data.author,
  files: data.files.map((f) => ({
    originalName: f.originalName,
    fileName: f.fileName,
  })),

  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});
