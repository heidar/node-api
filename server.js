'use strict';

var express = require('express'),
  app = express(),
  mongoose = require('mongoose');

app.configure('development', function() {
  app.use(express.logger());
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function() {
  app.use(express.logger());
  app.use(express.errorHandler());
});

app.configure(function () {
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

  app.post('/gigs.:format?', function(req, res) {
    var gig = new Gig({
      title: req.body.title,
      description: req.body.description
    });
    gig.save(function(err, gig) {
      if (err) {
        res.send(500, 'something went wrong');
      } else if (!req.params.format || req.params.format === 'json') {
        res.send(201, gig);
      }
    });
  });

  app.get('/gigs.:format?', function(req, res) {
    Gig.find({}, function(err, gigs) {
      if (err) {
        res.send(500, 'something went wrong');
      } else if (!req.params.format || req.params.format === 'json') {
        res.send(gigs);
      }
    });
  });

  app.get('/gigs/:id.:format?', function(req, res) {
    Gig.findById(req.params.id, function(err, gig) {
      if (err) {
        res.send(500, 'something went wrong');
      } else if (!req.params.format || req.params.format === 'json') {
        res.send(gig);
      }
    });
  });

  app.put('/gigs/:id.:format?', function(req, res) {
    Gig.findOneAndUpdate({_id: req.params.id}, req.body, function(err, gig) {
      if (err) {
        res.send(500, 'something went wrong');
      } else if (!req.params.format || req.params.format === 'json') {
        res.send(gig);
      }
    });
  });

  app.delete('/gigs/:id.:format?', function(req, res) {
    Gig.findOneAndRemove({_id: req.params.id}, function(err, gig) {
      if (err) {
        res.send(500, 'something went wrong');
      } else if (!req.params.format || req.params.format === 'json') {
        res.send(gig);
      }
    });
  });

});

app.listen(3000);