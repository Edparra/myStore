var mongoose = require('mongoose');
var Store = require('./models/thingsMod');
var User = require('./models/user');
//mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/things');

// our script will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

User.remove({});

console.log('removing old todos...');
Store.remove({})
.then(function() {
  console.log('old todos removed');
  console.log('creating some new todos...');
  var groceries  = new Store({ title: 'groceries',    completed: false });
  var feedTheCat = new Store({ title: 'feed the cat', completed: true  });
  return Store.create([groceries, feedTheCat]);
})
.then(function(savedTodos) {
  console.log('Just saved', savedTodos.length, 'todos.');
  return Store.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  return Store.findOne({title: 'groceries'});
})
.then(function(groceries) {
  groceries.completed = true;
  return groceries.save();
})
.then(function(groceries) {
  console.log('updated groceries:', groceries);
  return groceries.remove();
})
.then(function(deleted) {
  return Todo.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  quit();
});
