const React = require('react');
const Layout = require('../layouts/Layout');

function Index(props) {
    return (
        <Layout token={props.token}>
            <div className="container">
            <h1>📅 All Appointments</h1>

            <a href={`/appointments/new?token=${props.token}`} className="btn btn-primary">
                ➕ Create New Appointment
            </a>

            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {props.appointments.map(appt => (
                        <tr key={appt._id}>
                            <td>{appt.patient?.name} ({appt.patient?.cpr})</td>
                            <td>{appt.doctor?.name}</td>
                            <td>{appt.date ? new Date(appt.date).toLocaleDateString() : ''}</td>
                            <td>{appt.time || ''}</td>
                            <td>{appt.reason}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
            </div>
        </Layout>
    );
}

module.exports = Index;
