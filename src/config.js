const env = process.env.NODE_ENV;
const common = {
  port: 8880
};
const config = {
  develop: {
    mongodb: {
      connectionString: 'mongodb://localhost:27017/develop',
      certLocation: "/home/thulanis/Personal Projects/shopping-server/src/cert/mongodb/mongodb-db1-cert.crt",
      user: "shopping",
      password: "shopping2017",
      authdb: "admin",
      isSecure: "false"
    }
  },
  production: {
    mongodb: {
      baseUrl: 'mongodb://localhost:27017/production',
      certLocation: "/home/thulanis/Personal Projects/shopping-server/src/cert/mongodb/mongodb-db1-cert.crt",
      user: "shopping",
      password: "shopping2017",
      authdb: "admin",
      isSecure: "false"
    }
  },
  test: {
    mongodb: {
      baseUrl: 'mongodb://localhost:27017/test',
      certLocation: "/home/thulanis/Personal Projects/shopping-server/src/cert/mongodb/mongodb-db1-cert.crt",
      user: "shopping",
      password: "shopping2017",
      authdb: "admin",
      isSecure: "false"
    }
  }
};
module.exports = Object.assign(common, config['develop']);