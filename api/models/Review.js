const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place' },
    time: { type: Date, default: Date.now },
    rating: { type: Number, min: 0, max: 5, required: true },
    content: { type: String }
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;