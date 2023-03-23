module.exports = (data) => ({
  email: data.email,
  position: data.position || null,
  photo: data.photo || null,
  roles: data.roles.map((role) => ({
    id: role.id,
    title: role.title,
  })),
});
