const React = require('react');
const Layout = require('../layouts/Layout');

function RequestsList({ requests, token, type }) {
    return (
        <Layout token={token}>
            <h2>{type} Requests</h2>
            <form method="GET" action="" style={{ marginBottom: '20px' }}>
                <input type="hidden" name="token" value={token} />
                <input type="text" name="name" placeholder="Search by Name" onInput={(e) => fetchSuggestions('name', e.target.value, e)} />
                <input type="text" name="cpr" placeholder="Search by CPR" onInput={(e) => fetchSuggestions('cpr', e.target.value, e)} />
                <input type="text" name="phone" placeholder="Search by Phone" onInput={(e) => fetchSuggestions('phone', e.target.value, e)} />
                <button type="submit">Search</button>
            </form>

            {requests.length === 0 ? (
                <p>No {type} requests found.</p>
            ) : (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req._id}>
                                <td>{req.patient.name}</td>
                                <td>{req.doctor.name}</td>
                                <td>{req.status || 'Pending'}</td>
                                <td><a href={`/medicalRequests/${type}/${req._id}?token=${token}`}>View</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <script dangerouslySetInnerHTML={{
                __html: `
                function fetchSuggestions(field, query, event) {
                    const listId = field + '-list';
                    let list = document.getElementById(listId);
                    if (!list) {
                        list = document.createElement('datalist');
                        list.id = listId;
                        event.target.setAttribute('list', listId);
                        document.body.appendChild(list);
                    }
                    if (query.length === 0) { list.innerHTML = ''; return; }
                    fetch('/medicalRequests/searchSuggestions?field=' + field + '&query=' + query)
                        .then(res => res.json())
                        .then(data => {
                            list.innerHTML = '';
                            data.forEach(item => {
                                const opt = document.createElement('option');
                                opt.value = item;
                                list.appendChild(opt);
                            });
                        });
                }
                `
            }} />
        </Layout>
    );
}
module.exports = RequestsList;
