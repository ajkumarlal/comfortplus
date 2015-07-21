'use strict';

var express = require('express'),
    router = express.Router(),
    Reservation = require('../models/reservation.js'),
    StripeCharges = require('../models/stripecharges.js'),
    config = require('../_config.js'),
    stripe = require('stripe')('sk_test_51aTG9iUrOMeaaxshvv6hgVe');
    var passport = require('../auth');
    var twilio = require('../twilio')
    
router.post('/reservation', ensureAuthenticated, function (req, res, next) {
        var tmp = req.body['cellphone'];
        console.log(req.body['cellphone']);
        new Reservation.Reservation({CellPhone: tmp })
    .fetch()
    .then(function(data) {
        if (data===null) {
             req.flash('No Results', 'Sorry. That the cell phone number you have entered has returned any reservation. Try again.');
            return res.redirect('/login');
        } else {
            return res.render('Reservations', { reservations: data, user: req.user });
        }
    });
});

router.get('/query', ensureAuthenticated,  function(req, res, next){
  res.render('query', { user: req.user });
});

router.get('/login', function(req, res, next){
  res.render('login', { user: req.user });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      req.flash('success', 'Sorry. That username and/or password is incorrect. Try again.');
      return res.redirect('/login');
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.flash('success', 'Successfully logged in.');
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', ensureAuthenticated, function(req, res){
  req.logout();
  req.flash('success', 'Successfully logged out.');
  res.redirect('/');
});

router.get('/charge/:id', ensureAuthenticated, function (req, res, next) {
         new Reservation.Reservation({IdReservation: parseInt(req.params.id) })
        .fetch()
        .then(function(data) {
         var reservation1 = data;
        if (data===null) {
            return next();
        } else {
            return res.render('charge', { reservation: reservation1, cellPhone: data.get("CellPhone") });
        }
      });
});


router.get('/stripe', function (req, res, next) {
    res.send("Scram!");
});

router.post('/stripexxx', function (req, res, next) {
        
    // Obtain StripeToken
    var stripeToken = req.body.stripeToken;
    var email = req.body.email;
    var customerName = req.body.customerName;
    var amount = req.body.amount;
    var reservationId = req.body.reservationId;
    var cellPhone = req.body.cellPhone;
    
   
    // Create Charge
    var charge =
    {
        amount: parseFloat(amount) * 100,
        currency: 'USD',
        card: stripeToken,
        description: reservationId
    };
    
    stripe.charges.create(charge,
    function (err, charge) {
        if (err) {
            if (err) { return next(err); }
        } else {
            
            new StripeCharges.StripeCharges( { CellPhone: cellPhone, Amount :amount, ReservationsId: reservationId, CustomerName :customerName, Email : email })
            .save()
            .then(function(model){
                console.log('Successful save to Stripe!');
            });
            
            console.log('Successful charge sent to Stripe!');
            req.flash('success', 'Thanks for purchasing a Ride' + '!');
            res.redirect('/');
        }
    }
    );

});


router.post('/stripe', function (req, res, next) {
        
    // Obtain StripeToken
    var stripeToken = req.body.stripeToken;
    var email = req.body.email;
    var customerName = req.body.customerName;
    var amount = req.body.amount;
    var reservationId = req.body.reservationId;
    var cellPhone = req.body.cellPhone;
    
   
        stripe.customers.create({
        source : stripeToken,
        email : email,
        description: reservationId})
        .then(function(err, customer){
             if (err) {
                 if (err) { return next(err); }
             } else {
                 
             new StripeCharges.StripeCharges( {  CustomerId: customer.id, CellPhone: cellPhone, Amount :amount, ReservationsId: reservationId, CustomerName :customerName, Email : email })
            .save()
            .then(function(model){
                console.log('Successful save to Stripe!');
            });
             req.flash('success', 'Thanks for purchasing a Ride' + '!');
                  res.redirect('/');
            }
            
            });
        });
            
      
router.get('/congrats', ensureAuthenticated, function(req, res, next) {
  res.render('congrats', { user: req.user });
});

function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) { return next(); }
   req.flash('success', 'You must be signed in to view this page!');
   res.redirect('/login');
}

// Pass in parameters to the REST API using an object literal notation. The
// REST client will handle authentication and response serialzation for you.

router.get('/sendsms/:cellphone', ensureAuthenticated, function(req, res, next){
    
twilio.sms.messages.create({
    to:'+17327424867',
    from:'17323720512',
    body:'ahoy hoy! Testing Twilio and node.js'
}, function(error, message) {
    // The HTTP request to Twilio will run asynchronously. This callback
    // function will be called when a response is received from Twilio
    // The "error" variable will contain error information, if any.
    // If the request was successful, this value will be "falsy"
    if (!error) {
        // The second argument to the callback will contain the information
        // sent back by Twilio for the request. In this case, it is the
        // information about the text messsage you just sent:
        console.log('Success! The SID for this SMS message is:');
        console.log(message.sid);
 
        console.log('Message sent on:');
        console.log(message.dateCreated);
    } else {
        console.log('Oops! There was an error.');
    }
});
});


module.exports = router;