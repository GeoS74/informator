const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const controller = require('../controllers/docflow.controller');
const validator = require('../middleware/validators/docflow.params.validator');
const validatorSearch = require('../middleware/validators/search.params.validator');
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

/**
 * все роуты доступны только при наличии access токена
 * после проверки access токена в массив ctx.accessDocTypes
 * записываются все пары (напр./тип док-та)
 *
 * документы должны быть доступны для пользователя,
 * поэтому сначала выполняется проверка прав на взаимодействие с данным типом документа
 * Если прав нет, возвращается ошибка 403
 *
 */

router.use(accessCheck, validator.email, controller.getMe, controller.accessDocTypes);

// del this route
router.get('/', validator.limit, controller.getAll);

router.get(
  '/search/doc',
  validatorSearch.searchString,
  validatorSearch.lastId,
  validatorSearch.limit,
  validatorSearch.directingId,
  validatorSearch.tascId,

  controller.search,
);

router.get(
  '/search/doc/count',
  validatorSearch.searchString,
  validatorSearch.lastId,
  validatorSearch.limit,
  validatorSearch.directingId,
  validatorSearch.tascId,

  controller.searchCount,
);

router.get(
  '/:id',
  validator.objectId,
  validator.checkAccessDocTypesById,

  controller.get,
);

router.post(
  '/',
  koaBody(optional),
  validator.directingId,
  validator.taskId,
  validator.checkAccessDocTypes,

  validator.title,
  validator.acceptor,
  validator.recipient,
  validator.scanCopy,

  controller.add,
);
router.patch(
  '/:id',
  koaBody(optional),
  validator.objectId,
  validator.checkAccessDocTypesById,

  validator.directingId,
  validator.taskId,
  validator.title,
  validator.acceptor,
  validator.recipient,
  validator.scanCopy,
  controller.update,
);
router.delete(
  '/:id',
  validator.objectId,
  validator.checkAccessDocTypesById,

  controller.delete,
);

router.patch(
  '/file/:id',
  koaBody(optional),
  validator.objectId,
  validator.checkAccessDocTypesById,

  controller.deleteAtatchedFile,
);

module.exports.routes = router.routes();

// static files
module.exports.static = mount('/api/informator/docflow/scan', serve('./files/scan'));
