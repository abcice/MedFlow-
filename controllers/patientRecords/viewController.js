const Patient = require('../../models/patient');

const viewController = {
    // Show patient medical history
    showHistory(req, res) {
        const patient = res.locals.data.patient;
        let records = res.locals.data.records || [];
        const token = res.locals.data.token;
        const currentUser = res.locals.data.currentUser || null;

        // Hide privateNote for non-author doctors or non-doctors
        records = records.map(record => {
            const canViewPrivateNote =
                currentUser &&
                currentUser.role === 'Doctor' &&
                record.doctor &&
                record.doctor._id.toString() === currentUser._id.toString();

            if (!canViewPrivateNote) {
                const safeRecord = record.toObject();
                safeRecord.privateNote = undefined;
                return safeRecord;
            }
            return record;
        });

        res.render('patientRecords/Show', { patient, records, token });
    },

    // Show "New Medical Record" form
    async newView(req, res) {
        try {
            const patient = await Patient.findById(req.params.patientId);
            if (!patient) return res.status(404).send('Patient not found');

            res.render('patientRecords/New', {
                patient,
                token: res.locals.data.token,
                currentUser: req.user,
                favoritePrescriptions: []
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    // Redirect after saving new record
    redirectToHistory(req, res) {
        res.redirect(`/patientRecords/${req.body.patient}/history?token=${res.locals.data.token}`);
    },

    // Alternate history page
    history(req, res) {
        res.render('patients/History', {
            patient: res.locals.data.patient,
            records: res.locals.data.records,
            token: res.locals.data.token
        });
    },

    // Edit form for an existing medical record
    editView(req, res) {
        res.render('patientRecords/Edit', {
            patient: res.locals.data.patient,
            record: res.locals.data.record,
            token: res.locals.data.token,
            currentUser: res.locals.data.currentUser
        });
    },

    // List patients for record access
    index(req, res) {
        res.render('patientRecords/Index', {
            patients: res.locals.data.patients,
            token: res.locals.data.token
        });
    },

    // Show form for new Lab or Radiology request
    async newRequestView(req, res) {
        try {
            const patient = await Patient.findById(req.params.patientId);
            if (!patient) return res.status(404).send('Patient not found');

            res.render('patientRecords/NewRequest', {
                patient,
                token: res.locals.data.token,
                type: req.query.type,
                currentUser: req.user
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // After saving, redirect back to new record page
    redirectToNewRecord(req, res) {
        res.redirect(`/patientRecords/${req.params.patientId}/history/new?token=${req.query.token}`);
    }
};

module.exports = viewController;
