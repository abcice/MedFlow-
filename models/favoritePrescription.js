const mongoose = require('mongoose');

const FavoritePrescriptionSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, 
    drugs: [
        {
            drugName: String,
            dose: String,
            route: String,
            frequency: String,
            duration: String,
            notes: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('FavoritePrescription', FavoritePrescriptionSchema);
