const React = require('react');
const Layout = require('../layouts/Layout');

function Dashboard(props) {
    const token = props.token;

    return (
        <Layout token={token}>
            <h1>🏥 MedFlow Dashboard</h1>
            <p>Welcome! Please choose an option below.</p>
            <div className="dashboard-menu">
                <a href={`/patients?token=${token}`}>👥 Manage Patients</a>
                <a href={`/appointments?token=${token}`}>📅 Manage Appointments</a>
                <a href={`/patients/new?token=${token}`}>➕ Add New Patient</a>
                <a href={`/appointments/new?token=${token}`}>➕ Create Appointment</a>
            </div>
        </Layout>
    );
}

module.exports = Dashboard;
