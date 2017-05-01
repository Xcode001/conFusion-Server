favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        Favorites.find({})
            .populate('postedBy')
            .populate('dishes')
            .exec(function(err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        Favorites.find({ postedBy: req.decoded._doc._id }, function(err, fav) {
            if (err) throw err;
            else if (fav != null) {
                fav.dishes.push(req.body);
                fav.save(function(err, fav) {
                    if (err) throw err;
                    console.log('Updated Dishes!');
                    res.json(fav);
                });
            } else {
                req.body.postedBy = req.decoded._doc._id;
                Favorites.create(req.body, function(err, favorite) {
                    if (err) throw err;
                    console.log('Favorite created!');
                    var id = favorite._id;
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });

                    res.end('Added the Favorite with id: ' + id);
                });
            }
        });
    })

.delete(Verify.verifyOrdinaryUser, function(req, res, next) {
    Favorites.find({ postedBy: req.decoded._id }).remove().exec();
});
favoriteRouter.route('/:dishId')
    .delete(Verify.verifyOrdinaryUser, function(req, res, next) {
        Favorites.find({ postedBy: req.decoded._doc._id }, function(err, fav) {
            if (err) throw err;
            else if (fav != null) {
                fav.dishes.pop(req.params.dishId);
                fav.save(function(err, fav) {
                    if (err) throw err;
                    console.log('Updated Dishes!');
                    res.json(fav);
                });
            } else {
                var err = new Error('Dish is not Favorited yet!');
                err.status = 403;
                return next(err);
            }
        });
    });