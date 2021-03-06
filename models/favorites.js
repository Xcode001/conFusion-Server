var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
        unique: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Favorites', favoriteSchema);

// the schema is useless so far
// we need to create a model using it
var Favorites = mongoose.model('Favorites', favoriteSchema);

// make this available to our Node applications
module.exports = Favorites;