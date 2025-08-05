const React = require('react');
const Layout = require('../layouts/Layout');

function EditSickLeave({ sickLeave, token, recordId }) {
    return (
        <Layout token={token}>
            <h1>✏️ Edit Sick Leave</h1>
            <form
                action={`/patientRecords/${sickLeave.patient._id}/editSickLeave/${sickLeave._id}?token=${token}&recordId=${recordId}`}
                method="POST"
            >
                <label>Reason:</label>
                <textarea name="reason" defaultValue={sickLeave.reason}></textarea>

                <label>Duration (days):</label>
                <input type="number" name="durationDays" defaultValue={sickLeave.durationDays} />

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save</button>
                </div>
            </form>
        </Layout>
    );
}

module.exports = EditSickLeave;
