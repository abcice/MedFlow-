const Patient = require('../../models/patient');
const viewController = {
    // Show patient medical history
    showHistory(req, res) {
        const patient = res.locals.data.patient;
        let records = res.locals.data.records || [];
        const token = res.locals.data.token;
        const currentUser = res.locals.data.currentUser || null; // ✅ From auth middleware

        // Hide privateNote for non-author doctors or non-doctors
        records = records.map(record => {
            const canViewPrivateNote =
                currentUser &&
                currentUser.role === 'Doctor' &&
                record.doctor &&
                record.doctor._id.toString() === currentUser._id.toString();

            if (!canViewPrivateNote) {
                // Convert to object so we can modify safely
                const safeRecord = record.toObject();
                safeRecord.privateNote = undefined;
                return safeRecord;
            }
            return record;
        });

        res.render('patientRecords/Show', {
            patient,
            records,
            token
        });
    },

// controllers/patientRecords/viewController.js

newView: async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.patientId);
        if (!patient) {
            return res.status(404).send('Patient not found');
        }

        res.render('patientRecords/New', {
            patient,
            token: res.locals.data.token,
            currentUser: req.user, // from auth middleware
            favoritePrescriptions: [] // later you can query this
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
},


    // Redirect after saving new record
    redirectToHistory(req, res) {
        res.redirect(`/patientRecords/${req.body.patient}/history?token=${res.locals.data.token}`);
    },
    history(req, res) {
    res.render('patients/History', {
        patient: res.locals.data.patient,
        records: res.locals.data.records,
        token: res.locals.data.token
    });

    //edit
},
editView(req, res) {
    res.render('patientRecords/Edit', {
        patient: res.locals.data.patient,
        record: res.locals.data.record,
        token: res.locals.data.token,
        currentUser: res.locals.data.currentUser
    });
},
index(req, res) {
    res.render('patientRecords/Index', {
        patients: res.locals.data.patients,
        token: res.locals.data.token
    });
},
redirectToHistory(req, res) {
    res.redirect(`/patientRecords/${req.body.patient}/history?token=${res.locals.data.token}`);
}




};

module.exports = viewController;
