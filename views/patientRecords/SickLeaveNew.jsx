const React = require('react');
const Layout = require('../layouts/Layout');

function SickLeaveNew({ patient, token, latestDiagnosis  }) {
    return (
        <Layout token={token}>
            <h1>📝 Issue Sick Leave</h1>
            <p><strong>Patient:</strong> {patient.name} ({patient.cpr})</p>

                <form action={`/patientRecords/${patient._id}/history/newSickLeave?token=${token}`} method="POST">
                <input type="hidden" name="patient" value={patient._id} />

                <label>Diagnosis / Reason:</label>
                <textarea name="reason" defaultValue={sickLeave.reason || latestDiagnosis || ''}></textarea>


                <label>Start Date:</label>
                <input type="date" name="startDate" required />

                <label>Duration (days):</label>
                <input type="number" name="durationDays" required />

                <label>Additional Notes:</label>
                <textarea name="additionalNotes" />

                <button type="submit" className="btn btn-primary">💾 Save</button>
                <a href={`/patientRecords/${patient._id}/history?token=${token}`} className="btn btn-secondary">← Cancel</a>
            </form>
        </Layout>
    );
}

module.exports = SickLeaveNew;
