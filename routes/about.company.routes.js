const Router = require('koa-router');
const { koaBody } = require('koa-body');

const controller = require('../controllers/about.company.controller');
const validator = require('../middleware/validators/about.params.validator');

const router = new Router({ prefix: '/api/informator/about' });

router.get('/:alias', controller.get);
router.get('/', controller.getAll);
router.post('/', koaBody({ multipart: true }), validator.params, controller.add);
router.patch('/:alias', koaBody({ multipart: true }), controller.update);
router.delete('/:alias', controller.delete);

module.exports = router.routes();
