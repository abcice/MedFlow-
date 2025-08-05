const Appointment = require('../../models/appointment');
const Patient = require('../../models/patient');
const User = require('../../models/user');

const dataController = {};

// INDEX — Get doctors, appointments, and filters for schedule
dataController.index = async (req, res, next) => {
    try {
        let { date, doctor } = req.query;

        // Default to today if no date provided
        const selectedDate = date ? new Date(date) : new Date();
        selectedDate.setHours(0, 0, 0, 0);

        const startOfDay = new Date(selectedDate);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Fetch only doctors
        const doctors = await User.find({ role: 'Doctor' }).select('_id name role');

        // Appointment filter
        const filter = {
            startDateTime: { $gte: startOfDay, $lte: endOfDay }
        };
        if (doctor) {
            filter.doctor = doctor;
        }

        // Fetch appointments
        const appointments = await Appointment.find(filter)
            .populate('patient', 'name cpr')
            .populate('doctor', 'name role')
            .sort({ startDateTime: 1 });

        // Pass data to view
        res.locals.data.doctors = doctors;
        res.locals.data.appointments = appointments;
        res.locals.data.selectedDate = selectedDate.toISOString().split('T')[0];
        res.locals.data.selectedDoctor = doctor || '';
        res.locals.data.token = req.query.token || '';

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
