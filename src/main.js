// let 'babel-polyfill';
let express =  require('express');
let bodyParser =  require('body-parser');
let routes =  require('./routes');
let cors =  require('cors');
let { getLogger } =require("log4js");
let { User } =require('./models');
let async = require('async');
let logger = getLogger('THULANI SILINDA');
logger.level = 'debug';
let config =  require('./config');
let { errorHandle, db } =  require('./utils');
var _ = require('lodash');
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
app.all('*', function (req, res, next) {
  const token = req.headers.authorization;
      if (token && token !== null && token !== undefined) {
      User.findOne({ token }, function(err, user) {
        if (!err && user){
          req.user = user;
          next();
        } else {
          const excludeUrls = ['/user/create', '/user/login'];
          const index = _.indexOf(excludeUrls,req.url)
          // for (const excludeUrl of excludeUrls) {
            if (index >= 0) {
              next();
            } else {
              return res.send({ status: 401, msg: 'not authorized' });
            }
          // }
        }
      });
    } else {
      const excludeUrls = ['/user/create', '/user/login'];
      const index = _.indexOf(excludeUrls,req.url)
          // for (const excludeUrl of excludeUrls) {
        if (index >= 0) {
          next();
        } else {
          return res.send({ status: 401, msg: 'not authorized' });
        }
    }
});

app.use('/', routes);
// ensureLogin.init(app);

app.use(errorHandle);
const port = config.port;
app.listen(port, () => {
  logger.info(`App is listening on ${port}.`);
});

// module.exports = app;
