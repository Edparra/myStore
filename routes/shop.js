var express = require('express');
var router = express.Router();

var Store = require('../models/thingsMod');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    req.flash('error', 'hell Na')
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
  // get all the items and render the index view
 var thing = global.currentUser.items;
 var bank = currentUser.bank;
  res.render('things/index', { stuff: thing, message: req.flash(),
  bank: bank});

});

// NEW
router.get('/new', function(req, res, next) {
  res.render('things/new');
});

// SHOW
router.get('/:id', function(req, res, next) {
  var item = currentUser.items.id(req.params.id);
  if (!item) return next(makeError(res, 'Document not found', 404));
  res.render('things/show', { item: item, message: req.flash() } );

});

// CREATE
router.post('/', authenticate, function(req, res, next) {
  var make1 = {
    title: req.body.title,
    price: req.body.price,
    pic: req.body.pic,
 };

  currentUser.items.push(make1);
  currentUser.save()
  .then(function() {
    res.redirect('/shop');
  }, function(err) {
    return next(err);
  });
});
// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
  var change1 = currentUser.items.id(req.params.id);
  if (!change1) return next(makeError(res, 'Document not found', 404));
  res.render('things/edit', { item: change1, message: req.flash() } );
});

//Cash Out
router.put('/cashout', authenticate, function(req,res,next){
currentUser.bank = 0;
currentUser.save()
.then(function(){
  res.redirect('/shop');
}, function(err){
  return next(err);
});
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
  var upDate = currentUser.items.id(req.params.id);
  if (!upDate) return next(makeError(res, 'Document not found', 404));
  else {
    upDate.title = req.body.title;
    upDate.price = req.body.price;
    upDate.pic = req.body.pic;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/shop');
    }, function(err) {
      return next(err);
    });
  }
});



// Delete
router.delete('/:id', authenticate, function(req, res, next) {
  var destroy = currentUser.items.id(req.params.id);
  if (!destroy) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.items.indexOf(destroy);
  currentUser.items.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/shop');
  }, function(err) {
    return next(err);
  });
});



// Sell
router.post('/:id', authenticate, function(req, res, next){
  var sells = currentUser.items.id(req.params.id);
  var price = sells.price;
  currentUser.bank += price;
  currentUser.save()
  .then(function() {
    res.redirect('/shop');
  }, function(err) {
    return next(err);
  });
});








module.exports = router;
