const { readdir, mkdir } = require('node:fs/promises');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const mount = require('koa-mount');

const controller = require('../controllers/user.controller');
const validator = require('../middleware/validators/user.params.validator');
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

const router = new Router({ prefix: '/api/informator/user' });

/*
* все роуты доступны только при наличии access токена
* CRUD операции выполняются по email-у, передаваемом в access токене
* если проверка access токена выключена, срабатывает валидатор email
*/

router.all('/', accessCheck, validator.email);

router.get('/all', /* добавить сюда проверку на админа */ controller.getAll);
router.get('/', controller.get);
router.post('/', koaBody({ multipart: true }), validator.params, controller.add);
router.patch('/', koaBody({ multipart: true }), validator.params, controller.update);
router.delete('/', controller.delete);

router.all('/photo', accessCheck, validator.email);
router.patch('/photo', koaBody(optional), validator.photo, controller.photo);

module.exports.routes = router.routes();

// static files
module.exports.static = mount('/api/informator/user/photo', serve('./files/photo'));
