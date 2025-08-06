const React = require('react');
const Layout = require('../layouts/Layout');

function SickLeaveDetail({ sickLeave, token, userRole }) {
    return (
        <Layout token={token}>
            <h1>📝 Sick Leave Details</h1>
            <p><strong>Patient:</strong> {sickLeave.patient?.name}</p>
            <p><strong>Doctor:</strong> {sickLeave.doctor?.name}</p>
            <p><strong>Reason:</strong> {sickLeave.reason || '-'}</p>
            <p><strong>Duration:</strong> {sickLeave.durationDays || '-'}</p>

            {userRole === 'Doctor' && (
                <form method="POST" action={`/medicalRequests/sickLeaves/${sickLeave._id}?_method=DELETE&token=${token}`} onSubmit={(e) => { if (!confirm('Delete this sick leave?')) e.preventDefault(); }}>
                    <button type="submit" className="btn btn-danger mt-2">Delete</button>
                </form>
            )}

            <a href={`/medicalRequests/sickLeaves?token=${token}`} className="btn btn-secondary mt-3">← Go Back</a>
        </Layout>
    );
}

module.exports = SickLeaveDetail;
