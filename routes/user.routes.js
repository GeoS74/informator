const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/user.controller');
const validator = require('../middleware/validators/user.params.validator');
const accessCheck = require('../middleware/access.check');

const router = new Router({ prefix: '/api/informator/user' });

/*
* CRUD операции выполняются по email-у, передаваемом в access токене
*/

router.all('/', accessCheck);

router.get('/', controller.get);
router.get('/all', /* добавить сюда проверку на админа */ controller.getAll);
router.post('/', koaBody({ multipart: true }), validator.params, controller.add);
router.patch('/', koaBody({ multipart: true }), validator.params, controller.update);
router.delete('/', controller.delete);

module.exports = router.routes();
