const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingId: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    senderEmail: {type: String, required: true},
    date: {type: String, required: true},
    approval: {type: Boolean, default: false},
});

module.exports = Meeting = mongoose.model("meeting", meetingSchema);