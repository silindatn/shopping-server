const env = process.env.NODE_ENV;
const common = {
  port: 8880
};
const config = {
  develop: {
    mongodb: {
      connectionString: 'mongodb://matching-engine:27017/develop',
      certLocation: "/home/thulanis/Personal Projects/shopping-server/src/cert/mongodb/mongodb-db1-cert.crt",
      user: "shopping",
      password: "shopping2017",
      authdb: "admin",
      isSecure: "true"
    }
  },
  production: {
    mongodb: {
      baseUrl: 'mongodb://matching-engine:27017/production',
      certLocation: "/home/thulanis/Personal Projects/shopping-server/src/cert/mongodb/mongodb-db1-cert.crt",
      user: "shopping",
      password: "shopping2017",
      authdb: "admin",
      isSecure: "true"
    }
  },
  test: {
    mongodb: {
      baseUrl: 'mongodb://matching-engine:27017/test',
      certLocation: "/home/thulanis/Personal Projects/shopping-server/src/cert/mongodb/mongodb-db1-cert.crt",
      user: "shopping",
      password: "shopping2017",
      authdb: "admin",
      isSecure: "true"
    }
  }
};
module.exports = Object.assign(common, config['develop']);