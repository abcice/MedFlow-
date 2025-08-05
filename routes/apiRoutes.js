const express = require('express')
const router = express.Router()
const userApiController = require('../controllers/auth/apiController')
const patientApiController = require('../controllers/patients/apiController')
const patientDataController = require('../controllers/patients/dataController')
const appointmentApiController = require('../controllers/appointments/apiController')
const userDataController = require('../controllers/auth/dataController')



// User API Routes
router.post('/users', userApiController.createUser)
router.post('/users/login', userApiController.loginUser)
router.get('/users/profile', userApiController.auth, userApiController.getProfile)
router.put('/users/:id', userApiController.auth, userApiController.updateUser)
router.delete('/users/:id', userApiController.auth, userApiController.deleteUser)
// Patient API Routes
router.get('/patients', userApiController.auth, patientDataController.index, patientApiController.index)
router.post('/patients', userApiController.auth, patientDataController.show, patientApiController.show)
router.get('/patients/:id', userApiController.auth, patientDataController.create, patientApiController.create)
router.put('/patients/:id', userApiController.auth, patientDataController.update, patientApiController.update)
router.delete('/patients/:id', userApiController.auth, patientDataController.destroy, patientApiController.destroy)
// Appointment API Routes
// router.get('/appointments', appointmentApiController.getAllAppointments)
// router.post('/appointments', appointmentApiController.createAppointment)
// router.get('/appointments/:id', appointmentApiController.getAppointmentById)
// router.put('/appointments/:id', appointmentApiController.updateAppointment)
// router.delete('/appointments/:id', appointmentApiController.deleteAppointment)

module.exports = router 