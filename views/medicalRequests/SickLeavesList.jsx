const React = require('react');
const Layout = require('../layouts/Layout');

function SickLeavesList({ sickLeaves, token, userRole }) {
    const hasResults = sickLeaves && sickLeaves.length > 0;

    return (
        <Layout token={token}>
            <h1>📝 Sick Leaves</h1>

            <form method="GET" action="/medicalRequests/sickLeaves" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input list="nameList" id="name" name="name" placeholder="Patient Name" className="form-control" style={{ flex: '1' }} />
                <datalist id="nameList"></datalist>

                <input list="cprList" id="cpr" name="cpr" placeholder="CPR" className="form-control" style={{ flex: '1' }} />
                <datalist id="cprList"></datalist>

                <input list="phoneList" id="phone" name="phone" placeholder="Phone" className="form-control" style={{ flex: '1' }} />
                <datalist id="phoneList"></datalist>

                <input type="hidden" name="token" value={token} />
                <button type="submit" className="btn btn-primary">🔍 Search</button>
            </form>

            {hasResults ? (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Reason</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sickLeaves.map(sl => (
                            <tr key={sl._id}>
                                <td>{sl.patient.name}</td>
                                <td>{sl.doctor.name}</td>
                                <td>{sl.reason || '-'}</td>
                                <td>{sl.durationDays || '-'}</td>
                                <td style={{ display: 'flex', gap: '5px' }}>
                                    <a href={`/medicalRequests/sickLeaves/${sl._id}?token=${token}`} className="btn btn-sm btn-primary">View</a>
                                    {userRole === 'Doctor' && (
                                        <form method="POST" action={`/medicalRequests/sickLeaves/${sl._id}?_method=DELETE&token=${token}`} onSubmit={(e) => { if (!confirm('Are you sure you want to delete this sick leave?')) e.preventDefault(); }}>
                                            <button type="submit" className="btn btn-sm btn-danger">Delete</button>
                                        </form>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No results yet. Please search for a patient.</p>
            )}
        </Layout>
    );
}

module.exports = SickLeavesList;
