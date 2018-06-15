let express =  require('express');
let handler = express();
let user =  require('./user');
let product =  require('./product');
let { swagDocHandler } =  require('../utils');

const router = new express.Router();

router.get('/', async (req, res) => {
  res.send({ msg: 'HELLO WORLD' });
});

// return swagger doc json data.
// open [http://swagger.daguchuangyi.com/?url=http://localhost:8888/swagger.json#!]
// to use Swagger UI to visualize the doc
router.get('/swagger.json', swagDocHandler);
handler.use('/', router);
// example user routes providing: [create|login|get] method.
handler.use('/user', user);
handler.use('/product', product);

module.exports = handler;
