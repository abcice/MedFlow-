const React = require('react');
const Layout = require('../layouts/Layout');

function ReferralLetterDetail({ letter, token, userRole }) {
    return (
        <Layout token={token}>
            <h1>📄 Referral Letter Details</h1>
            <p><strong>Patient:</strong> {letter.patient?.name}</p>
            <p><strong>Doctor:</strong> {letter.doctor?.name}</p>
            <p><strong>Referred To:</strong> {letter.referredTo || '-'}</p>
            <p><strong>Reason:</strong> {letter.reason || '-'}</p>

            {userRole === 'Doctor' && (
                <form method="POST" action={`/medicalRequests/referralLetters/${letter._id}?_method=DELETE&token=${token}`} onSubmit={(e) => { if (!confirm('Delete this referral letter?')) e.preventDefault(); }}>
                    <button type="submit" className="btn btn-danger mt-2">Delete</button>
                </form>
            )}

            <a href={`/medicalRequests/referralLetters?token=${token}`} className="btn btn-secondary mt-3">← Go Back</a>
        </Layout>
    );
}

module.exports = ReferralLetterDetail;
