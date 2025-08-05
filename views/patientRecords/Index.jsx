const React = require('react');
const Layout = require('../layouts/Layout');

function Index({ patients, token }) {
    return (
        <Layout token={token}>
            <h1>📜 Patient Records</h1>

            {/* Search form */}
            <form method="GET" action="/patientRecords" style={{ marginBottom: '20px' }}>
                <input type="hidden" name="token" value={token} />
                <input
                    type="text"
                    name="search"
                    placeholder="Search by name, CPR, or phone..."
                    style={{ padding: '5px', width: '250px' }}
                />
                <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* Patient list */}
            {patients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>CPR</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient._id}>
                                <td>{patient.name}</td>
                                <td>{patient.cpr}</td>
                                <td>{patient.phone || 'N/A'}</td>
                                <td>
                                    <a href={`/patients/${patient._id}/history?token=${token}`} className="btn btn-primary">
                                        View History
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    );
}

module.exports = Index;
