'use strict';

var express = require('express'),
  app = express(),
  mongoose = require('mongoose');

app.configure(function () {
  app.use(express.logger('dev'));
  app.use(express.json());
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
        res.send(500, 'something went wrong');
      } else {
        res.send(201, gig);
      }
    });
  });

  app.get('/gigs', function(req, res) {
    Gig.find({}, function(err, gigs) {
      if (err) {
        res.send(500, 'something went wrong');
      } else {
        res.send(gigs);
      }
    });
  });

  app.get('/gigs/:id', function(req, res) {
    Gig.findById(req.params.id, function(err, gig) {
      if (err) {
        res.send(500, 'something went wrong');
      } else {
        res.send(gig);
      }
    });
  });

  app.delete('/gigs/:id', function(req, res) {
    Gig.findById(req.params.id, function(err, gig) {
      if (err) {
        res.send(500, 'something went wrong');
      } else {
        gig.remove(function(err, gig) {
          res.send(gig);
        });
      }
    });
  });

});

app.listen(3000);