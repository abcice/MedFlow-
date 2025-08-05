const PatientRecord = require('../../models/patientRecord');
const Patient = require('../../models/patient');
const User = require('../../models/user');
const Prescription = require('../../models/prescription');
const Request = require('../../models/request');

const dataController = {};

/**
 * Helper: Fetch patient history with privateNote filtering
 */
async function fetchPatientHistory(patientId, currentUser) {
    let records = await PatientRecord.find({ patient: patientId })
        .populate('doctor', 'name _id role')
        .populate('prescriptions')
        .populate('labRequests')
        .populate('radiologyRequests')
        .sort({ visitDate: -1 })
        .lean();

    // Hide privateNote if not the author or Admin
    records = records.map(rec => {
        if (rec.privateNote) {
            const isOwner = rec.doctor?._id?.toString() === currentUser?._id?.toString();
            const isAdmin = currentUser?.role === 'Admin';
            if (!isOwner && !isAdmin) {
                rec.privateNote = null;
            }
        }
        return rec;
    });

    return records;
}

/**
 * Show full patient medical history
 */
dataController.showHistory = async (req, res, next) => {
    try {
        const patientId = req.params.patientId;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const records = await fetchPatientHistory(patientId, req.user);

        res.locals.data.patient = patient;
        res.locals.data.records = records;
        res.locals.data.token = req.query.token || '';
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Alternate history fetch by :id (patients/:id/history)
 */
dataController.getHistory = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        const records = await fetchPatientHistory(patient._id, req.user);

        res.locals.data.patient = patient;
        res.locals.data.records = records;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Create a new patient record
 */
dataController.create = async (req, res, next) => {
    try {
        // Verify that doctor exists and is a Doctor
        const doctor = await User.findById(req.body.doctor);
        if (!doctor || doctor.role !== 'Doctor') {
            return res.status(400).json({ message: 'Invalid doctor ID or role' });
        }

        // Validate patient exists
        const patient = await Patient.findById(req.body.patient);
        if (!patient) {
            return res.status(400).json({ message: 'Patient not found' });
        }

        // Optional: validate prescriptions & requests exist
        if (req.body.prescriptions?.length) {
            const validPrescriptions = await Prescription.find({ _id: { $in: req.body.prescriptions } });
            if (validPrescriptions.length !== req.body.prescriptions.length) {
                return res.status(400).json({ message: 'Invalid prescription(s) provided' });
            }
        }

        if (req.body.labRequests?.length) {
            const validLabs = await Request.find({ _id: { $in: req.body.labRequests } });
            if (validLabs.length !== req.body.labRequests.length) {
                return res.status(400).json({ message: 'Invalid lab request(s) provided' });
            }
        }

        if (req.body.radiologyRequests?.length) {
            const validRadios = await Request.find({ _id: { $in: req.body.radiologyRequests } });
            if (validRadios.length !== req.body.radiologyRequests.length) {
                return res.status(400).json({ message: 'Invalid radiology request(s) provided' });
            }
        }

        // Create record
        const newRecord = await PatientRecord.create(req.body);
        res.locals.data.record = newRecord;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
/**
 * Show a specific patient record
 */
dataController.showRecord = async (req, res, next) => {
    try {
        const record = await PatientRecord.findById(req.params.id)
            .populate('patient')
            .populate('doctor', 'name _id');
        if (!record) return res.status(404).send('Record not found');

        res.locals.data.patient = record.patient;
        res.locals.data.record = record;
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
//list patients for records access
dataController.listPatients = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { cpr: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const patients = await require('../../models/patient').find(query).sort({ name: 1 });

        res.locals.data.patients = patients;
        res.locals.data.token = req.query.token || '';
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
/**
 * Update an existing patient record
 */
dataController.updateRecord = async (req, res, next) => {
    try {
        const record = await PatientRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        res.locals.data.record = record;
        res.locals.data.patient = await Patient.findById(record.patient);
        next();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Create a new Lab or Radiology request
dataController.createRequest = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) return res.status(404).send('Patient not found');

        const doctor = req.user;
        if (!doctor || doctor.role !== 'Doctor') {
            return res.status(403).send('Only doctors can create requests');
        }

        const newRequest = await Request.create({
            patient: patient._id,
            doctor: doctor._id,
            type: req.query.type, // Lab or Radiology from URL
            details: req.body.details
        });

        res.locals.data.request = newRequest;
        next();
    } catch (error) {
        res.status(400).send(error.message);
    }
};




module.exports = dataController;
