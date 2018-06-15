let express =require('express');
let sha1 =require('sha1');
let randomstring =require('randomstring');
let { getLogger } =require("log4js");
let logger = getLogger('Syslutions');
logger.level = 'debug';

let { User, Account, Transaction } =require('./../models');

const router = new express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: user list
 *     description: return user list
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: users
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 */
router.get('/', async (req, res) => {
  const users = await User.find();
  return res.send({ users });
});
router.post('/account_balance', async (req, res) => {
  const { name } = req.body;
  try {
    const user = await User.findOne({
      name
    });
    if (user) {
      let account = await Account.findOne({owner: user._id});
      if(account){
        res.send({code:'00', message: 'account balance successful', data: account})
      } else {
        res.send({code:'06', message: 'account balance unsuccessful', data: account})
      }
    } else {
      next({ msg: 'user does not exist', status: 401 });
    }
  } catch (err) {
    next(err);
  }
});
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: user login
 *     description: user login,return user info with token
 *     tags:
 *       - User
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         description: user and password
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: username
 *             password:
 *               type: string
 *               default: password
 *     responses:
 *       200:
 *         description: useinfo including token
 */
router.post('/login', async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({
      name,
      password: sha1(password)
    });
    if (user) {
      return res.send(user);
    }
    next({ msg: 'wrong username or password', status: 401 });
  } catch (err) {
    next(err);
  }
});
router.post('/top-up', async (req, res, next) => {
  const { name, amount } = req.body;
  try {
    let transaction = new Transaction({
      name: 'Top-up',
      request: req.body,
      amount: amount,
    })
    const user = await User.findOne({
      name
    });
    if (user) {
      let account = await Account.findOne({owner: user._id});
      transaction.user = user._id;
      if(account){
        account.balance = parseInt(amount);
        account.lastTopUpDate = Date.now();
        account = await account.save();
        transaction.response = {code:'00', message: 'account top-up successful', data: account};
        transaction = await transaction.save();
        res.send({code:'00', message: 'account top-up successful', data: account})
      } else {
        transaction.response = {code:'06', message: 'account top-up unsuccessful', data: account};
        transaction = await transaction.save();
        res.send({code:'06', message: 'account top-up unsuccessful', data: account})
      }
    } else {
      transaction.response = { msg: 'user does not exist', status: 401 };
      transaction = await transaction.save();
      next({ msg: 'user does not exist', status: 401 });
    }
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: register user
 *     description: create user
 *     tags:
 *       - User
 *     parameters:
 *       - name: user
 *         in: body
 *         required: true
 *         description: username and password
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               default: username
 *             password:
 *               type: string
 *               default: password
 *     responses:
 *       200:
 *         description: create new user
 */
router.post('/create', async (req, res, next) => {
  const { name, password, role } = req.body;
  try {
    const token = `Token ${randomstring.generate(20)}${Date.now()}${randomstring.generate(20)}`;
    let user = await User.findOne({ name });
    if (user) {
      return next({ msg: 'user already existed', status: 403 });
    }
    user = new User({
      name,
      ower: sha1(password),
      role: role,
      token,
    });
    user = await user.save();
    if(user.role === 'user') {
    account = new Account({
      name,
      owner: user._id,
    });
    account = await account.save();
    return res.send(user);
    } else {
      return res.send(user);
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
