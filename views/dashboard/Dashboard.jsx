const React = require('react');
const Layout = require('../layouts/Layout');

function Dashboard(props) {
    const token = props.token;

    return (
        <Layout token={token}>
            <div className="dashboard-container">
                <h1>📊 Dashboard</h1>
                <p className="dashboard-subtitle">
                    Welcome to <strong>MedFlow</strong>! Choose an action below:
                </p>

                <div className="dashboard-buttons">
                    <a href={`/patients?token=${token}`} className="dashboard-btn btn-primary">👥 View Patients</a>
                    <a href={`/patients/new?token=${token}`} className="dashboard-btn btn-primary">➕ Add New Patient</a>
                    <a href={`/appointments?token=${token}`} className="dashboard-btn btn-primary">📅 View Appointments</a>
                    <a href={`/appointments/new?token=${token}`} className="dashboard-btn btn-primary">➕ Create Appointment</a>
                    <a href={`/patientRecords?token=${token}`} className="dashboard-btn btn-primary">📜 Patient Records</a>
                    <a href={`/medicalRequests?token=${token}`} className="dashboard-btn btn-warning">🧪 Medical Requests</a>
                    <a href={`/appointments/schedule?token=${token}`} className="btn btn-primary dashboard-btn">📅 View Schedule</a>

                    
                </div>
            </div>
        </Layout>
    );
}

module.exports = Dashboard;
