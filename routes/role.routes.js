const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/role.controller');
const validator = require('../middleware/validators/role.params.validator');
const accessCheck = require('../middleware/access.check');

const router = new Router({ prefix: '/api/role' });

router.get('/:id', controller.get);
router.get('/', accessCheck, controller.getAll);
router.post('/', accessCheck, koaBody({ multipart: true }), validator.params, controller.add);
router.patch('/:id', accessCheck, koaBody({ multipart: true }), controller.update);
router.delete('/:id', accessCheck, controller.delete);

module.exports = router.routes();