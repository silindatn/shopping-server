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
#To run the server :
1. install mongodb and start mongodb
2. install nodejs and npm
3. git clone https://github.com/silindatn/shopping-server.git
4. cd shopping-server
# install the project's dependencies
5. npm install
6. npm install -g pm2
7. pm2 start ./src/main.js
8. pm2 logs # to see the server side logs

# shopping-server
# MESSAGE
