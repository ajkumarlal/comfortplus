var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reservation = new Schema({
    reservation: String,
    amount: Number,
    currency: String,
    customeremail: String,
    paid: { type: Boolean, default: false }
});

module.exports = mongoose.model('reservations', Reservation);