const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Patient', 
        required: true 
    },
    appointment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Appointment' 
    }, // Optional link to appointment
    amountDue: { 
        type: Number, 
        required: true 
    },
    amountPaid: { 
        type: Number, 
        default: 0 
    },
    paymentMethod: { 
        type: String, 
        enum: ['Cash', 'Insurance'], 
        required: true 
    },
    insuranceProvider: String, // Only if paymentMethod is Insurance
    paymentDate: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Partially Paid'], 
        default: 'Pending' 
    }
}, { timestamps: true });

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
