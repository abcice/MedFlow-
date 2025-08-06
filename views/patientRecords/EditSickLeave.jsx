const React = require('react');
const Layout = require('../layouts/Layout');

function EditSickLeave({ sickLeave, token, recordId, currentUser, latestDiagnosis }) {

    return (
        <Layout token={token}>
            <h1>📝 Edit Sick Leave</h1>

            <p><strong>Patient:</strong> {sickLeave.patient.name}</p>
            <p><strong>Doctor:</strong> {sickLeave.doctor.name}</p>

            <form method="POST" action={`/patientRecords/${sickLeave.patient._id}/editSickLeave/${sickLeave._id}?token=${token}&recordId=${recordId}`}>
            <input type="hidden" name="recordId" value={recordId || ''} />

                <label>Diagnosis / Reason:</label>
                <textarea name="reason" defaultValue={sickLeave.reason || latestDiagnosis || ''}></textarea>

                <label>Start Date:</label>
                <input type="date" name="startDate" defaultValue={sickLeave.startDate?.substring(0, 10) || ''} />

                <label>Duration (days):</label>
                <input type="number" name="durationDays" defaultValue={sickLeave.durationDays || ''} />

                <label>Additional Notes:</label>
                <textarea name="additionalNotes" defaultValue={sickLeave.additionalNotes || ''} />

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save Changes</button>
                    <a href={`/patientRecords/${recordId}/edit?token=${token}`} className="btn btn-secondary">← Go Back</a>
                </div>
            </form>

            {currentUser?.role === 'Doctor' && (
                <form
                    method="POST"
                    action={`/patientRecords/${sickLeave.patient._id}/deleteSickLeave/${sickLeave._id}?token=${token}&_method=DELETE`}
                    style={{ marginTop: '20px' }}
                    onSubmit={(e) => {
                        if (!confirm('Are you sure you want to delete this sick leave?')) e.preventDefault();
                    }}
                >
                    <button type="submit" className="btn btn-danger">🗑 Delete Sick Leave</button>
                </form>
            )}
        </Layout>
    );
}

module.exports = EditSickLeave;
