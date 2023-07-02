const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    place: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Place' },
    time: { type: Date, default: Date.now },
    grade: { type: Number, min: 1, max: 5, required: true },
    review: { type: String }
});

const ReviewModel = mongoose.model('Booking', reviewSchema);

module.exports = ReviewModel;