const express = require('express');
const morgan = require('morgan');
const jsxEngine = require('jsx-view-engine');
const methodOverride = require('method-override');

const userRoutes = require('./controllers/auth/routeController');
const patientsRoutes = require('./controllers/patients/routeController');
const dashboardRoutes = require('./controllers/dashboard/routeController');

const medicalRequestsRoutes = require('./controllers/medicalRequests/routeController');
const appointmentsRoutes = require('./controllers/appointments/routeController')
const apiRoutes = require('./routes/apiRoutes');
const passToken = require('./middleware/passToken');

const patientRecordRoutes = require('./controllers/patientRecords/routeController');


const app = express();

// View Engine
app.set('view engine', 'jsx');
app.engine('jsx', jsxEngine());

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    res.locals.data = {};
    next();
});
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(passToken);

// Web Routes
app.use('/users', userRoutes);    
app.use('/patients', patientsRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/patientRecords', patientRecordRoutes);

// API Routes
app.use('/api', apiRoutes);
// Dashboard Route
app.use('/dashboard', dashboardRoutes);
//medical requests route
app.use('/medicalRequests', medicalRequestsRoutes);


module.exports = app;
