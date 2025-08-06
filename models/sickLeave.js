const mongoose = require('mongoose');

const sickLeaveSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, default: ''  },
    durationDays: { type: Number, default: ''  },
    issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SickLeave', sickLeaveSchema);
