'use strict';

var express = require('express'),
  app = express(),
  mongoose = require('mongoose');

app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
});

mongoose.connect('mongodb://localhost/node-api');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  var gigSchema = mongoose.Schema({
    title:        String,
    description:  String
  });
  var Gig = mongoose.model('Gig', gigSchema);

  app.post('/gigs', function(req, res) {
    var gig = new Gig({
      title: req.body.title,
      description: req.body.description
    });
    gig.save(function(err, gig) {
      if (err) {
        throw err;
      } else {
        res.send(201, gig);
      }
    });
  });
  
  app.get('/gigs', function(req, res) {
    Gig.find({}, function(err, docs) {
      if (err) {
        throw err;
      } else {
        res.send(docs);
      }
    });
  });

});

app.listen(3000);