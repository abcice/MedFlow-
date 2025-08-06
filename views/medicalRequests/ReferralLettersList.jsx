const React = require('react');
const Layout = require('../layouts/Layout');

function ReferralLettersList({ referralLetters, token, userRole }) {
    const hasResults = referralLetters && referralLetters.length > 0;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <Layout token={token}>
            <h1>📄 Referral Letters</h1>

            {/* Search Form */}
            <form 
                method="GET" 
                action="/medicalRequests/referralLetters" 
                style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}
            >
                <input list="nameList" id="name" name="name" placeholder="Patient Name" className="form-control" style={{ flex: '1' }} />
                <datalist id="nameList"></datalist>

                <input list="cprList" id="cpr" name="cpr" placeholder="CPR" className="form-control" style={{ flex: '1' }} />
                <datalist id="cprList"></datalist>

                <input list="phoneList" id="phone" name="phone" placeholder="Phone" className="form-control" style={{ flex: '1' }} />
                <datalist id="phoneList"></datalist>

                <input type="hidden" name="token" value={token} />
                <button type="submit" className="btn btn-primary">🔍 Search</button>
            </form>

            {/* Referral Letters Table */}
            {hasResults ? (
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Referred To</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {referralLetters.map(rl => (
                            <tr key={rl._id}>
                                <td>{formatDate(rl.createdAt)}</td>
                                <td>{rl.patient.name}</td>
                                <td>{rl.doctor.name}</td>
                                <td>{rl.referredTo || '-'}</td>
                                <td>{rl.reason || '-'}</td>
                                <td style={{ display: 'flex', gap: '5px' }}>
                                    <a 
                                        href={`/medicalRequests/referralLetters/${rl._id}/official?token=${token}`} 
                                        className="btn btn-sm btn-info"
                                    >
                                        View Referral Letter
                                    </a>
                                    {userRole === 'Doctor' && (
                                        <form 
                                            method="POST" 
                                            action={`/medicalRequests/referralLetters/${rl._id}?token=${token}&_method=DELETE`} 
                                            onSubmit={(e) => { 
                                                if (!confirm('Are you sure you want to delete this referral letter?')) e.preventDefault(); 
                                            }}
                                        >
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

module.exports = ReferralLettersList;
