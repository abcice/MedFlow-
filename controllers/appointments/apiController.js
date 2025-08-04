const Appointment = require('../../models/appointment');

const dataController = {
    // List all appointments
    index: async (req, res, next) => {
        try {
            const appointments = await Appointment.find({});
            res.locals.data.appointments = appointments;
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Show one appointment
    show: async (req, res, next) => {
        try {
            const appointment = await Appointment.findById(req.params.id);
            if (!appointment) throw new Error('Appointment not found');
            res.locals.data.appointment = appointment;
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Create
    create: async (req, res, next) => {
        try {
            const appointment = await Appointment.create(req.body);
            res.locals.data.appointment = appointment;
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update
    update: async (req, res, next) => {
        try {
            const appointment = await Appointment.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.locals.data.appointment = appointment;
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete
    destroy: async (req, res, next) => {
        try {
            await Appointment.findByIdAndDelete(req.params.id);
            next();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = dataController;
