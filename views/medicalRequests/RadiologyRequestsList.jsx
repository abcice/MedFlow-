const React = require('react');
const Layout = require('../layouts/Layout');

function RadiologyRequestsList({ token, requests }) {
    return (
        <Layout token={token}>
            <h1>🩻 Radiology Requests</h1>

            <form method="GET" style={{ marginBottom: '20px' }}>
                <input type="text" name="name" placeholder="Patient Name" />
                <input type="text" name="cpr" placeholder="CPR" />
                <input type="text" name="phone" placeholder="Phone" />
                <button type="submit" className="btn btn-info">Search</button>
            </form>

            <table className="table">
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Status</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(req => (
                        <tr key={req._id}>
                            <td>{req.patient?.name}</td>
                            <td>{req.doctor?.name}</td>
                            <td>{req.status || 'Pending'}</td>
                            <td>
                                <a href={`/medicalRequests/radiology/${req._id}?token=${token}`} className="btn btn-primary">View</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <a href={`/medicalRequests?token=${token}`} className="btn btn-secondary">← Go Back</a>
        </Layout>
    );
}

module.exports = RadiologyRequestsList;
