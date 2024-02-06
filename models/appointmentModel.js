const mongoose = require('mongoose')

const appointmenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    doctorInfo: {
        type: Object,
        required: true
    },
    userInfo: {
        type: Object,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    selectedTimings: {
        type: Array,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'pending'
    },
}, {
    timestamps: true
});

const appointments = mongoose.model('appointment', appointmenSchema);
module.exports = appointments

