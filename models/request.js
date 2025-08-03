const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    appointment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment' 
    },
    type: { 
        type: String, 
        enum: ['Lab', 'Radiology'], 
        required: true 
    },
    details: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ['Pending', 'Completed'], 
        default: 'Pending' 
    },
    result: String 
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
