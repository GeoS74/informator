const Koa = require('koa');
const { readdir, mkdir } = require('node:fs/promises');

(async () => {
  try {
    await readdir('./files');
  } catch (error) {
    mkdir('./files');
  }
})();

const app = new Koa();

app.use(ctx => {
  ctx.status = 200;
  ctx.body = 'hello'
})

module.exports = app;