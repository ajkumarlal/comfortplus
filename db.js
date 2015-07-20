var dbConfig = {
   client : 'mysql',
   connection: {
   host: 'localhost',  // your host
   user: 'root', // your database user
   password: '', // your database password
   database: 'test',
   charset: 'UTF8_GENERAL_CI'
   }
};

var knex =require('knex')(dbConfig);
var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;