module.exports = (function() {
    'use strict';

    var mongoose = require('mongoose');

    var Promotions = require('../models/promotions');

    var bodyParser = require('body-parser');

    var promoRouter = require('express').Router();

    promoRouter.use(bodyParser.json());

    var Verify = require('./verify');

    promoRouter.route('/')
        .get(Verify.verifyOrdinaryUser, function(req, res, next) {
            Promotions.find({}, function(err, promotion) {
                if (err) throw err;
                res.json(promotion);
            });
        })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
            Promotions.create(req.body, function(err, promotion) {
                if (err) throw err;
                console.log('Promotion created!');
                var id = promotion._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the Promotion with id: ' + id);
            });
        })
        .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
            Promotions.remove({}, function(err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });

    promoRouter.route('/:id')
        .get(function(req, res, next) {
            Promotions.findById(req.params.id, function(err, promotion) {
                if (err) throw err;
                res.json(promotion);
            });
        })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Promotions.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function(err, promotion) {
            if (err) throw err;
            res.json(promotion);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        Promotions.findByIdAndRemove(req.params.id, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

    return promoRouter;
})();