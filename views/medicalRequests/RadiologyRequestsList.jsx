const React = require('react');
const Layout = require('../layouts/Layout');

function RadiologyRequestsList({ requests, token }) {
    return (
        <Layout token={token}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '20px' }}>🩻 Radiology Requests</h1>

                {/* Search Form */}
                <form 
                    method="GET" 
                    action={`/medicalRequests/radiology`} 
                    style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}
                >
                    <input 
                        list="nameList" 
                        id="name" 
                        name="name" 
                        placeholder="Patient Name" 
                        className="form-control"
                        style={{ flex: '1' }}
                    />
                    <datalist id="nameList"></datalist>

                    <input 
                        list="cprList" 
                        id="cpr" 
                        name="cpr" 
                        placeholder="CPR" 
                        className="form-control"
                        style={{ flex: '1' }}
                    />
                    <datalist id="cprList"></datalist>

                    <input 
                        list="phoneList" 
                        id="phone" 
                        name="phone" 
                        placeholder="Phone" 
                        className="form-control"
                        style={{ flex: '1' }}
                    />
                    <datalist id="phoneList"></datalist>

                    <input type="hidden" name="token" value={token} />
                    <button type="submit" className="btn btn-primary">🔍 Search</button>
                </form>

                {/* Requests Table */}
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>CPR</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req._id}>
                                <td>{req.patient.name}</td>
                                <td>{req.patient.cpr}</td>
                                <td>{req.doctor.name}</td>
                                <td>{req.status || 'Pending'}</td>
                                <td>
                                    <a 
                                        href={`/medicalRequests/radiology/${req._id}?token=${token}`} 
                                        className="btn btn-sm btn-primary"
                                    >
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <a href={`/medicalRequests?token=${token}`} className="btn btn-secondary mt-3">← Go Back</a>

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
            </div>
        </Layout>
    );
}

module.exports = RadiologyRequestsList;
