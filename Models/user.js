var bookshelf = require('../db');

var User = bookshelf.Model.extend({
   tableName: 'admin'
   });

module.exports = {
   User: User
};
