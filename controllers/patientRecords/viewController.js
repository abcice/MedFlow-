const Patient = require('../../models/patient');
const Prescription = require('../../models/prescription');

const viewController = {
    showHistory(req, res) {
        const { patient, records = [], token, currentUser = null } = res.locals.data;

        const filteredRecords = records.map(record => {
            const canViewPrivateNote =
                currentUser &&
                currentUser.role === 'Doctor' &&
                record.doctor &&
                record.doctor._id.toString() === currentUser._id.toString();

            if (!canViewPrivateNote) {
                record.privateNote = undefined;
            }
            return record;
        });

        res.render('patientRecords/Show', {
            patient,
            records: filteredRecords,
            token
        });
    },

    async newView(req, res) {
        try {
            const patient = await Patient.findById(req.params.patientId);
            if (!patient) return res.status(404).send('Patient not found');

            const getIds = (name) => req.query[name] ? [].concat(req.query[name]) : [];

            res.render('patientRecords/New', {
                patient,
                token: req.query.token || '',
                currentUser: req.user,
                favoritePrescriptions: [],
                labRequestIds: getIds('labRequestIds'),
                radiologyRequestIds: getIds('radiologyRequestIds'),
                sickLeaveIds: getIds('sickLeaveIds'),
                referralLetterIds: getIds('referralLetterIds'),
                prescriptionData: {
                    drugName: '',
                    dose: '',
                    route: '',
                    frequency: '',
                    duration: '',
                    notes: ''
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    async editView(req, res) {
        try {
            const patient = res.locals.data.patient;
            const record = res.locals.data.record;
            const token = res.locals.data.token;
            const currentUser = res.locals.data.currentUser;

            // Fetch latest prescription linked to this record
            let prescriptionData = {
                drugName: '',
                dose: '',
                route: '',
                frequency: '',
                duration: '',
                notes: ''
            };

            if (record.prescriptions && record.prescriptions.length > 0) {
                const lastPrescription = await Prescription.findById(
                    record.prescriptions[record.prescriptions.length - 1]
                ).lean();

                if (lastPrescription && lastPrescription.drugs.length > 0) {
                    prescriptionData = {
                        drugName: lastPrescription.drugs[0]?.name || '',
                        dose: lastPrescription.drugs[0]?.dose || '',
                        route: lastPrescription.drugs[0]?.route || '',
                        frequency: lastPrescription.drugs[0]?.frequency || '',
                        duration: lastPrescription.drugs[0]?.duration || '',
                        notes: lastPrescription.notes || ''
                    };
                }
            }

            res.render('patientRecords/Edit', {
                patient,
                record,
                token,
                currentUser,
                prescriptionData
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    },

    redirectToHistory(req, res) {
        res.redirect(`/patientRecords/${req.body.patient}/history?token=${res.locals.data.token}`);
    },

    history(req, res) {
        res.render('patients/History', {
            patient: res.locals.data.patient,
            records: res.locals.data.records,
            token: res.locals.data.token
        });
    },

    index(req, res) {
        res.render('patientRecords/Index', {
            patients: res.locals.data.patients,
            token: res.locals.data.token
        });
    }
};

module.exports = viewController;
