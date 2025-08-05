const React = require('react');
const Layout = require('../layouts/Layout');

function Edit(props) {
    const {
        record,
        patient,
        token,
        currentUser,
        favoritePrescriptions = []
    } = props;

    return (
        <Layout token={token}>
            <h1>✏️ Edit Medical Record</h1>

            {/* Patient Info */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                {patient.photo && (
                    <img src={patient.photo} alt={`${patient.name}'s photo`} style={{ width: '120px', borderRadius: '8px' }} />
                )}
                <div>
                    <h2>{patient.name}</h2>
                    <p><strong>CPR:</strong> {patient.cpr}</p>
                    <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    {patient.blacklisted && <p style={{ color: 'red' }}>🚫 Blacklisted</p>}
                </div>
            </div>

            <form action={`/patientRecords/saveDraft?token=${token}`} method="POST">
                <input type="hidden" name="recordId" value={record._id} />
                <input type="hidden" name="patient" value={patient._id} />
                <input type="hidden" name="doctor" value={currentUser._id} />

                <label>Doctor:</label>
                <input type="text" value={currentUser.name} disabled />

                <label>Complaint:</label>
                <textarea name="complaint" defaultValue={record.complaint}></textarea>

                <label>Examination:</label>
                <textarea name="examination" defaultValue={record.examination}></textarea>

                <label>Diagnosis:</label>
                <textarea name="diagnosis" defaultValue={record.diagnosis}></textarea>

                <label>Treatment Plan:</label>
                <textarea name="treatmentPlan" defaultValue={record.treatmentPlan}></textarea>

                {/* Action Buttons */}
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" name="action" value="Lab" className="btn btn-secondary">🧪 Lab Request</button>
                    <button type="submit" name="action" value="Radiology" className="btn btn-secondary">🩻 Radiology Request</button>
                    <button type="submit" name="action" value="SickLeave" className="btn btn-secondary">📝 Sick Leave</button>
                    <button type="submit" name="action" value="ReferralLetter" className="btn btn-secondary">📄 Referral Letter</button>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" name="action" value="SaveOnly" className="btn btn-primary">💾 Save</button>
                    <a href={`/patientRecords/${patient._id}/history?token=${token}`} className="btn btn-secondary">← Go Back</a>
                </div>
            </form>
        </Layout>
    );
}

module.exports = Edit;
