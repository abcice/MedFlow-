const Appointment = require('../../models/appointment');
const Patient = require('../../models/patient');
const User = require('../../models/user');

const dataController = {};

// INDEX — Get all appointments
dataController.index = async (req, res, next) => {
    try {
        res.locals.data.appointments = await Appointment.find({})
            .populate('patient', 'name cpr')
            .populate('doctor', 'name role');
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// CREATE — Create appointment using patient CPR
dataController.create = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ cpr: req.body.patientCPR });
        if (!patient) {
            return res.status(400).json({ message: 'Patient with given CPR not found' });
        }

        req.body.patient = patient._id;
        delete req.body.patientCPR;

        const appointment = await Appointment.create(req.body);
        res.locals.data.appointment = appointment;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// SHOW — Get appointment details
dataController.show = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name cpr')
            .populate('doctor', 'name');

        const doctors = await User.find({ role: 'Doctor' }).select('_id name');

        res.locals.data.appointment = appointment;
        res.locals.data.doctors = doctors;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// UPDATE — Edit appointment
dataController.update = async (req, res, next) => {
    try {
        // If patient CPR is changed, find the patient
        if (req.body.patientCPR) {
            const patient = await Patient.findOne({ cpr: req.body.patientCPR });
            if (!patient) {
                return res.status(400).json({ message: 'Patient with given CPR not found' });
            }
            req.body.patient = patient._id;
            delete req.body.patientCPR;
        }

        await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DESTROY — Delete appointment
dataController.destroy = async (req, res, next) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = dataController;
