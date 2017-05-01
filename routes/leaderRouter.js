module.exports = (function() {
    'use strict';

    var mongoose = require('mongoose');

    var Leaderships = require('../models/leaderships');

    var bodyParser = require('body-parser');

    var leaderRouter = require('express').Router();

    var Verify = require('./verify');

    leaderRouter.use(bodyParser.json());

    leaderRouter.route('/')
        .get(Verify.verifyOrdinaryUser, function(req, res, next) {
            Leaderships.find({}, function(err, leadership) {
                if (err) throw err;
                res.json(leadership);
            });
        })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
            Leaderships.create(req.body, function(err, leadership) {
                if (err) throw err;
                console.log('leadership created!');
                var id = leadership._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the leadership with id: ' + id);
            });
        })
        .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
            Leaderships.remove({}, function(err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });

    leaderRouter.route('/:id')
        .get(Verify.verifyOrdinaryUser, function(req, res, next) {
            Leaderships.findById(req.params.id, function(err, leadership) {
                if (err) throw err;
                res.json(leadership);
            });
        })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Leaderships.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function(err, leadership) {
            if (err) throw err;
            res.json(leadership);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Leaderships.findByIdAndRemove(req.params.id, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

    return leaderRouter;
})();