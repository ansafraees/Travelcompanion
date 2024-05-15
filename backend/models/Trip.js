const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    rating: { type: Number },
    user_ratings:{type:Number},
});

const itinerarySchema = new mongoose.Schema({
    time: { type: Number },
    attraction: attractionSchema,
});

const tripSchema = new mongoose.Schema({
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'travelUser' },
    location: { type: String },
    tripItinerary: itinerarySchema,
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);