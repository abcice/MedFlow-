const React = require('react');
const Layout = require('../layouts/Layout');

function LabRequestsList({ requests, token, userRole }) {
    const hasResults = requests && requests.length > 0;

    return (
        <Layout token={token}>
            <h1>🧪 Lab Requests</h1>

            {/* Search Form */}
            <form method="GET" action="/medicalRequests/lab" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                            <th>CPR</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req._id}>
                                <td>{req.patient.name}</td>
                                <td>{req.patient.cpr}</td>
                                <td>{req.doctor.name}</td>
                                <td>{req.status || 'Pending'}</td>
                                <td style={{ display: 'flex', gap: '5px' }}>
                                    <a href={`/medicalRequests/lab/${req._id}?token=${token}`} className="btn btn-sm btn-primary">View</a>
                                    {userRole === 'Doctor' && (
                                        <form method="POST" action={`/medicalRequests/lab/${req._id}?_method=DELETE&token=${token}`} onSubmit={(e) => { if (!confirm('Are you sure you want to delete this request?')) e.preventDefault(); }}>
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

            <script dangerouslySetInnerHTML={{
                __html: `
                    function setupAutocomplete(fieldId, listId) {
                        const input = document.getElementById(fieldId);
                        const list = document.getElementById(listId);
                        input.addEventListener('input', async () => {
                            const val = input.value;
                            if (!val) { list.innerHTML = ''; return; }
                            const res = await fetch('/medicalRequests/searchSuggestions?field=' + fieldId + '&query=' + val + '&token=${token}');
                            const suggestions = await res.json();
                            list.innerHTML = '';
                            suggestions.forEach(s => {
                                const option = document.createElement('option');
                                option.value = s;
                                list.appendChild(option);
                            });
                        });
                    }
                    setupAutocomplete('name', 'nameList');
                    setupAutocomplete('cpr', 'cprList');
                    setupAutocomplete('phone', 'phoneList');
                `
            }} />
        </Layout>
    );
}

module.exports = LabRequestsList;
