// let 'babel-polyfill';
let express =  require('express');
let bodyParser =  require('body-parser');
let routes =  require('./routes');
let cors =  require('cors');
let { getLogger } =require("log4js");
let { User } =require('./models');
let async = require('async');
let logger = getLogger('Syslutions');
logger.level = 'debug';
let config =  require('./config');
let { errorHandle, db } =  require('./utils');

db.init();

// error handle
process.on('unhandledRejection', err => {
  throw err;
});

process.on('uncaughtException', err => {
  logger.error('uncaughtException:', err);
});

const app = express();

app.use(cors());
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use('/', routes);
app.all('*', function (req, res, handle) {
  const token = req.headers.authorization;
  async.waterfall([
    function checkToken(next){
      if (token) {
      User.findOne({ token }, function(err, user) {
        if (!err && user){
          req.user = user;
          next(null, user);
        }
      });
    } else {
      const excludeUrls = ['/user/create', '/user/login'];
      for (const excludeUrl of excludeUrls) {
        if (req.url.indexOf(excludeUrl) === 0) {
          return next(null, null, true);
        }
      }
      next({ status: 401, msg: 'not authorized' });
    }

    }
  ],
function done(err, user, unsecure){
  if(user || unsecure) {
    handle();
  }else {
    handle(err);
  }
});
});
// ensureLogin.init(app);

app.use(errorHandle);
const port = config.port;
app.listen(port, () => {
  logger.info(`App is listening on ${port}.`);
});

// module.exports = app;
