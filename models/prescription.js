const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
    }, // Optional — link to appointment
    drugs: [
        {
            name: { type: String, required: true },
            dose: String, // e.g. "500mg"
            route: String, // e.g. "Oral", "IV"
            frequency: String, // e.g. "Twice daily"
            duration: String  // e.g. "5 days"
        }
    ],
    notes: String // Extra instructions for patient or pharmacist
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
