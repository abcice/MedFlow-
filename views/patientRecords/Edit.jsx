const React = require('react');
const Layout = require('../layouts/Layout');

function Edit(props) {
    const { patient, record, token, currentUser } = props;

    // Check if logged-in doctor can see the private note
    const canViewPrivateNote =
        currentUser &&
        currentUser.role === 'Doctor' &&
        record.doctor &&
        record.doctor._id.toString() === currentUser._id.toString();

    return (
        <Layout token={token}>
            <h1>✏️ Edit Medical Record</h1>
            <p><strong>Patient:</strong> {patient.name} ({patient.cpr})</p>

            <form action={`/patientRecords/${record._id}?_method=PUT&token=${token}`} method="POST">
                <input type="hidden" name="patient" value={patient._id} />
                <input type="hidden" name="doctor" value={record.doctor?._id || ''} />

                <label>Complaint:</label>
                <textarea name="complaint" defaultValue={record.complaint}></textarea>

                <label>Examination:</label>
                <textarea name="examination" defaultValue={record.examination}></textarea>

                <label>Diagnosis:</label>
                <textarea name="diagnosis" defaultValue={record.diagnosis}></textarea>

                <label>Treatment Plan:</label>
                <textarea name="treatmentPlan" defaultValue={record.treatmentPlan}></textarea>

                {canViewPrivateNote && (
                    <>
                        <label>Private Note (Doctor only):</label>
                        <textarea name="privateNote" defaultValue={record.privateNote}></textarea>
                    </>
                )}

                <button type="submit" className="btn btn-primary">💾 Save Changes</button>
                <a href={`/patients/${patient._id}/history?token=${token}`} className="btn btn-secondary">
                    ← Back to History
                </a>
            </form>
        </Layout>
    );
}

module.exports = Edit;
