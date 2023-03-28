const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/docflow.controller');
const validator = require('../middleware/validators/docflow.params.validator');
const accessCheck = require('../middleware/access.check');

(async () => {
  try {
    await readdir('./files/photo');
  } catch (error) {
    mkdir('./files/photo', {
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
  validator.title,
  validator.directingId,
  validator.taskId,
  validator.scanCopy,
  controller.add,
);
router.patch(
  '/:id',
  koaBody(optional),
  validator.objectId,
  validator.title,
  validator.directingId,
  validator.taskId,
  validator.scanCopy,
  controller.update,
);
router.delete('/:id', validator.objectId, controller.delete);

module.exports = router.routes();
