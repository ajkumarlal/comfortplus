'use strict';

var express = require('express'),
    router = express.Router(),
    Reservation = require('../models/reservation.js'),
    StripeCharges = require('../models/stripecharges.js'),
    config = require('../_config.js'),
    stripe = require('stripe')('sk_test_51aTG9iUrOMeaaxshvv6hgVe');
    var passport = require('../auth');
    
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


module.exports = router;