var express = require('express'),
    router = express.Router(),
    Reservation = require('../models/reservation.js'),
    passport = require('../auth');
    //moment = require('moment'),
   // User = require('../models/user');



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


router.post('/reservation', function (req, res, next) {
    new Reservation.Reservation({CellPhone: req.params.id })
    .fetch()
    .then(function(data) {
        if (data===null) {
            return next();
        } else {
            return res.render('Reservations', { reservations: data, user: req.user });
        }
    });
});


// router.get('/logout', ensureAuthenticated, function(req, res){
//   req.logout();
//   req.flash('success', 'Successfully logged out.');
//   res.redirect('/');
// });
// 
// router.get('/profile', ensureAuthenticated, function(req, res){
//   res.render('profile', { user: req.user });
// });
// 
// router.get('/admin', ensureAuthenticated, function(req, res){
//   return User.find({}, function(err, data) {
//     if (err) {
//       return next(err);
//     } else {
//       var allProducts = [];
//       for (var i = 0; i < data.length; i++) {
//         if (data[i].products.length > 0) {
//           for (var j = 0; j < data[i].products.length; j++) {
//             allProducts.push(data[i].products[j]);
//           }
//         }
//       }
//       console.log(allProducts);
//       return res.render('admin', {data: allProducts, moment: moment, user: req.user});
//     }
//   });
// });


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.redirect('/login');
// }


module.exports = router;
