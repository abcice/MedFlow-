const React = require('react');
const Layout = require('../layouts/Layout');

function Index(props) {
    const token = props.token;

    return (
        <Layout token={token}>
            <div className="appointments-container">
                <h1>📅 All Appointments</h1>

                <div className="appointments-header">
                    <a href={`/appointments/new?token=${token}`} className="btn btn-primary">
                        ➕ Create New Appointment
                    </a>
                </div>

                {props.appointments.length === 0 ? (
                    <p className="no-data">No appointments found.</p>
                ) : (
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Duration (min)</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.appointments.map(appt => (
                                <tr key={appt._id}>
                                    <td>{appt.patient?.name} ({appt.patient?.cpr})</td>
                                    <td>{appt.doctor?.name}</td>
                                    <td>{appt.date ? new Date(appt.date).toLocaleDateString() : ''}</td>
                                    <td>{appt.time || ''}</td>
                                    <td>{appt.estimatedDuration || '-'}</td>
                                    <td>{appt.reason}</td>
                                    <td className="actions">
                                        <a href={`/appointments/${appt._id}/edit?token=${token}`} className="btn btn-secondary small-btn">
                                            ✏️ Edit
                                        </a>
                                        <form
                                            action={`/appointments/${appt._id}?_method=DELETE&token=${token}`}
                                            method="POST"
                                            style={{ display: 'inline' }}
                                        >
                                            <button type="submit" className="btn btn-danger small-btn">
                                                🗑️ Delete
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}

module.exports = Index;
