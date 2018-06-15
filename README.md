# Node Rest Api

A simple template for building a node restful api service

- nodejs
- express
- mongodb
- mocha
- swagger-jsdoc

``` bash
# mongodb config
# config locate in: src/config.js
mongodb: {
  host: 'localhost',
  database: 'example'
}
# or you can add an mongodb account for security
mongodb: {
  host: 'localhost',
  database: 'example',
  user:'user',
  password:'pwd'
}

npm run start

npm run build

npm run test

