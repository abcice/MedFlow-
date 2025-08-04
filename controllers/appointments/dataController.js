const Appointment = require('../../models/appointment');
const Patient = require('../../models/patient');

const dataController = {};

// INDEX
dataController.index = async (req, res, next) => {
    try {
        // Populate patient and doctor details for display
        res.locals.data.appointments = await Appointment.find({})
            .populate('patient', 'name cpr')
            .populate('doctor', 'name role');
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create appointment using patient CPR
dataController.create = async (req, res, next) => {
    try {
        // 1️⃣ Find the patient by CPR
        const patient = await Patient.findOne({ cpr: req.body.patientCPR });
        if (!patient) {
            return res.status(400).json({ message: 'Patient with given CPR not found' });
        }

        // 2️⃣ Replace CPR with ObjectId for saving
        req.body.patient = patient._id;
        delete req.body.patientCPR; // remove CPR field so it doesn't get saved accidentally

        // 3️⃣ Create the appointment
        const appointment = await Appointment.create(req.body);

        // 4️⃣ Store in res.locals for view/api controllers
        res.locals.data.appointment = appointment;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = dataController;
