const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const controller = require('../controllers/docflow.controller');
const validator = require('../middleware/validators/docflow.params.validator');
const accessCheck = require('../middleware/access.check');

(async () => {
  try {
    await readdir('./files/scan');
  } catch (error) {
    mkdir('./files/scan', {
      recursive: true,
    });
  }
})();

const optional = {
  formidable: {
    uploadDir: './files',
    allowEmptyFiles: false,
    minFileSize: 1,
    multiples: true,
    hashAlgorithm: 'md5',
    keepExtensions: true,
  },
  multipart: true,
};

const router = new Router({ prefix: '/api/informator/docflow' });

router.use(accessCheck);
router.get('/:id', validator.objectId, controller.get);
router.get('/', controller.getAll);
router.post(
  '/',
  koaBody(optional),
  validator.directingId,
  validator.taskId,
  validator.title,
  validator.author,
  validator.scanCopy,
  controller.add,
);
router.patch(
  '/:id',
  koaBody(optional),
  validator.objectId,
  validator.directingId,
  validator.taskId,
  validator.title,
  validator.author,
  validator.scanCopy,
  controller.update,
);
router.delete('/:id', validator.objectId, controller.delete);

router.patch(
  '/file/:id',
  koaBody(optional),
  validator.objectId,
  controller.deleteAtatchedFile,
);

module.exports.routes = router.routes();

// static files
module.exports.static = mount('/api/informator/docflow/scan', serve('./files/scan'));
