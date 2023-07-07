const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userAct: {type: String, required: true},
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    place: {type: String, required: true},
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true }
});

const NotiModel = mongoose.model('noti', notiSchema);

module.exports = NotiModel;