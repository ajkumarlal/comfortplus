var bookshelf = require('../db');

var StripeCharges = bookshelf.Model.extend({
   tableName: 'stripecharges'
   });

module.exports = {
   StripeCharges: StripeCharges
};
