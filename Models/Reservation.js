var bookshelf = require('../db');

var Reservation = bookshelf.Model.extend({
   tableName: 'reservation'
   });

module.exports = {
   Reservation: Reservation
};
