module.exports = (data) => ({
  email: data.email,
  rank: data.rank,
  position: data.position || null,
  photo: data.photo || null,
});
