const React = require('react');
const Layout = require('../layouts/Layout');

function Dashboard(props) {
    const token = props.token;
    const user = props.user; // optional, if you pass logged-in user info

    return (
        <Layout token={token}>
            <h1>🏥 MedFlow Dashboard</h1>

            {user && (
                <h2>Welcome back, {user.name} ({user.role})</h2>
            )}

            <p>Select an action below to get started:</p>

            <div className="dashboard-links">
                <a href={`/patients?token=${token}`} className="btn btn-primary">
                    👥 View Patients
                </a>
                <a href={`/patients/new?token=${token}`} className="btn btn-success">
                    ➕ Add New Patient
                </a>
                <a href={`/appointments/new?token=${token}`} className="btn btn-info">
                    ➕ Create New Appointment
                </a>

                <a href={`/appointments?token=${token}`} className="btn btn-info">
                    📅 View Appointments
                </a>
                <a href={`/requests?token=${token}`} className="btn btn-warning">
                    🧪 View Requests
                </a>
            </div>
        </Layout>
    );
}

module.exports = Dashboard;
