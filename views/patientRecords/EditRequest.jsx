const React = require('react');
const Layout = require('../layouts/Layout');

function EditRequest({ request, token, recordId, prescriptionData, currentUser }) {
    return (
        <Layout token={token}>
            <h1>🧾 Edit {request.type} Request</h1>

            <p><strong>Patient:</strong> {request.patient.name}</p>
            <p><strong>Doctor:</strong> {request.doctor.name}</p>

            <form method="POST" action={`/patientRecords/${request.patient._id}/editRequest/${request._id}?token=${token}`}>
                <label>Details:</label>
                <textarea name="details" defaultValue={request.details || ''}></textarea>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save Changes</button>
                    <a href={`/patientRecords/${recordId}/edit?token=${token}`} className="btn btn-secondary">← Go Back</a>
                </div>
            </form>

            {currentUser?.role === 'Doctor' && (
                <form
                    method="POST"
                    action={`/patientRecords/${request.patient._id}/deleteRequest/${request._id}?token=${token}&_method=DELETE`}
                    style={{ marginTop: '20px' }}
                    onSubmit={(e) => {
                        if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
                            e.preventDefault();
                        }
                    }}
                >
                    <button type="submit" className="btn btn-danger">🗑 Delete Request</button>
                </form>
            )}
        </Layout>
    );
}

module.exports = EditRequest;
