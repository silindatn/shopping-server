let mongoose =require('mongoose');
let { getLogger } =require("log4js");
let logger = getLogger('THULANI SILINDA');
let async = require('async');
logger.level = 'debug';
let config =require('../config');
let fs = require('fs');
const { connectionString, database, user, password } = config.mongodb;
let status = 'DISCONNETED';
const init = () => {
  if (status === 'DISCONNETED') {
    let options = {
      useMongoClient: true,
      poolSize: 100,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 100,
      bufferMaxEntries: 0,
      keepAlive: 120,
      autoReconnect: true,
      ssl: true,
      sslValidate: true,
  };
  let optionsAlternative = {
    server: {
      poolSize: 100,
      socketOptions: {
        keepAlive: 120,
        auto_reconnect: true
      },
      ssl: true,
      sslValidate: true
    },
    auth: {},
    socketOptions: {
      keepAlive: 120,
      auto_reconnect: true
    }
  }
  mongoose.set('debug', false);
  if (config.mongodb.isSecure === 'true') {
      async.waterfall([
          function _url (next) {
              let url = connectionString;
              if (url != null) {
                  options['url'] = url;
                  next();
              } else {
                  next('#engine.db.conn.url.invalid');
              }
          },
          function _cert_location (next) {
              let certLocation = config.mongodb.certLocation;
              if (certLocation != null) {
                  next(null, certLocation);
              } else {
                  next('#engine.db.conn.cert_path.invalid');
              }
          },
          function _cert_buffer (uri, next) {
              let cert = [fs.readFileSync(uri)];
              if (!cert || cert === null || cert === '') {
                  next('#engine.db.conn.cert_file.invalid');
              } else {
                  options['sslCA'] = fs.readFileSync(uri);
                  next();
              }
          },
          function _username (next) {
              let user = config.mongodb.user;
              let password = config.mongodb.password;
              if (user != null && user !== undefined && password != null && password !== undefined) {
                  options.auth['user'] = user;
                  options.auth['password'] = password;
                  next();
              } else {
                  next('#engine.mongodb.conn.credentials.invalid');
              }
          },
          function _auth_db (next) {
              let authdb = config.mongodb.authdb;
              if (authdb != null && authdb !== undefined) {
                  options['authSource'] = authdb;
                  next();
              } else {
                  next('#engine.db.conn.auth_db.invalid');
              }
          },

          function _connect (next) {
              mongoose.Promise = global.Promise;
              const url = options.url;
              delete options.url;
              mongoose.connect(url, options, function (err) {
                  next(err, mongoose.connection);
              });
          },
          function (conn, next) {
              conn.on('disconnecting', function () {
                  logger.fatal(' DISCONNECTING');
              });
              conn.on('disconnected', function () {
                  logger.fatal(' DISCONNECTED : ', new Date());
                  process.exit(1);
              });
              conn.on('close', function () {
                  logger.fatal(' CONNECTION CLOSED : ', new Date());
                  process.exit(1);
              });
              conn.on('error', function (err) {
                  logger.fatal(' SHUTTING DOWN, ERROR:', err);
                  process.exit(1);
              });
              next();
          }
      ],
          function _done (err) {
              logger.info('DATABASE STATUS:', err ? 'FAILED - ' + err : 'OK');
          });
  } else {
      logger.info('Connecting to insecure database');
      async.waterfall([
          function _url (next) {
              let url = connectionString;
              if (url != null) {
                  next();
              } else {
                  next('#engine.db.conn.url.invalid');
              }
          },

          function _connect (next) {
              mongoose.Promise = global.Promise;

              options.ssl = false;
              options.sslValidate = false;
            // optionsAlternative.server.ssl = false;
            // optionsAlternative.server.sslValidate = false;

              mongoose.connect(connectionString, options, function (err) {
                  next(err, mongoose.connection);
              });
          },
          function (conn, next) {
              conn.on('disconnecting', function () {
                  logger.fatal(' DISCONNECTING');
              });
              conn.on('disconnected', function () {
                  logger.fatal(' DISCONNECTED : ', new Date());
                  process.exit(1);
              });
              conn.on('close', function () {
                  logger.fatal(' CONNECTION CLOSED : ', new Date());
                  process.exit(1);
              });
              conn.on('error', function (err) {
                  logger.fatal(' SHUTTING DOWN, ERROR:', err);
                  process.exit(1);
              });
              next();
          }
      ],
          function _done (err) {
              logger.info('DATABASE STATUS:', err ? 'FAILED - ' + err : 'OK');
          });
  }
  }
};

module.exports = { init };
