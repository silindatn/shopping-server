let express =require('express');
let sha1 =require('sha1');
let randomstring =require('randomstring');
let { getLogger } =require("log4js");
let logger = getLogger('Syslutions');
logger.level = 'debug';

let { User, Account, Product, Transaction } =require('./../models');

const router = new express.Router();

/**
 * @swagger
 * /product:
 *   get:
 *     summary: product list
 *     description: return product list
 *     tags:
 *       - product
 *     responses:
 *       200:
 *         description: products
 *         schema:
 *           type: object
 *           properties:
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/product'
 */
router.get('/', async (req, res) => {
  const products = await Product.find({});
  return res.send({ products });
});
router.post('/transactions', async (req, res) => {
  const { query } = req.body;
  const transactions = await Transaction.find(query);
  return res.send({ transactions });
});

/**
 * @swagger
 * /product/login:
 *   post:
 *     summary: product login
 *     description: product login,return product info with token
 *     tags:
 *       - product
 *     parameters:
 *       - name: product
 *         in: body
 *         required: true
 *         description: product and password
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: productname
 *             password:
 *               type: string
 *               default: password
 *     responses:
 *       200:
 *         description: useinfo including token
 */

router.post('/purchase', async (req, res, next) => {
  const { name, amount, product_name } = req.body;
  try {
    let transaction = new Transaction({
      name: 'Purchase',
      request: req.body,
      amount: amount,
    })
    const user = await User.findOne({
      name
    });
    const product = await Product.findOne({
      name: product_name
    });
    if (product && user) {
      let account = await Account.findOne({owner: user._id});
      transaction.product = product._id;
      transaction.user = user._id;
      if(account){
        account.balance =account.balance - parseInt(amount);
        account.lastTopUpDate = Date.now();
        account = await account.save();
        transaction.response = {code:'00', message: 'purchase successful', data: account};
        transaction = await transaction.save();
        res.send({code:'00', message: 'purchase successful', data: account})
      } else {
        transaction.response = {code:'06', message: 'purchase unsuccessful', data: account};
        transaction = await transaction.save();
        res.send({code:'06', message: 'purchase unsuccessful', data: account})
      }
    } else {
      transaction.response = { msg: 'product does not exist', status: 401 };
      transaction = await transaction.save();
      next({ msg: 'product does not exist', status: 401 });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /product/create:
 *   post:
 *     summary: register product
 *     description: create product
 *     tags:
 *       - product
 *     parameters:
 *       - name: product
 *         in: body
 *         required: true
 *         description: productname and password
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: productname
 *             password:
 *               type: string
 *               default: password
 *     responses:
 *       200:
 *         description: create new product
 */
router.post('/create', async (req, res, next) => {
  const { name, image, price, special_discount } = req.body;
  try {
    let product = await Product.findOne({ name });
    if (product) {
      return next({ msg: 'product already existed', status: 403 });
    }
    product = new Product({
      name,
      image,
      price,
      special_discount
    });
    product = await product.save();
    return res.send(product);
  } catch (err) {
    next(err);
  }
});

router.post('/update', async (req, res, next) => {
    const { name, image, price, special_discount } = req.body;
    try {
      let product = await Product.findOne({ name });
      if (product) {
      product.image = image!==''&&image!==undefined? image: product.image;
      product.price  = price!==''&&price!==undefined? price: product.price;
      product.special_discount = special_discount!==''&&special_discount!==undefined? special_discount: product.special_discount
      product = await product.save();
      return res.send(product);
      } else {
        return next({ msg: 'product does not existed', status: 403 });
      }
    } catch (err) {
      next(err);
    }
});
module.exports = router;
