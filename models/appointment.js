const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ['Scheduled', 'Completed', 'Cancelled'], 
        default: 'Scheduled' 
    },
    reason: String,

    // New Field: Estimated Duration
    estimatedDuration: { 
        type: Number, // store in minutes
        min: 5,       // optional validation
        max: 480      // optional validation (8 hours)
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
