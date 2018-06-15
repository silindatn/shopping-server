let { User } =require('./../models');
let ensureLogin = exports = module.exports = {};
let async = require('async');
ensureLogin.init = function (server) {
  server.all('*', function (req, res, handle) {
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
}
module.exports = ensureLogin;
