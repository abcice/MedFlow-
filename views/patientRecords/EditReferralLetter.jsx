const React = require('react');
const Layout = require('../layouts/Layout');

function EditReferralLetter({ referralLetter, token, recordId, currentUser }) {
    return (
        <Layout token={token}>
            <h1>📄 Edit Referral Letter</h1>

            <p><strong>Patient:</strong> {referralLetter.patient.name}</p>
            <p><strong>Doctor:</strong> {referralLetter.doctor.name}</p>

<form method="POST" action={`/patientRecords/${referralLetter.patient._id}/editReferralLetter/${referralLetter._id}?token=${token}&recordId=${recordId}`}>
            <input type="hidden" name="recordId" value={recordId || ''} />

                <label>Referred To:</label>
                <input type="text" name="referredTo" defaultValue={referralLetter.referredTo || ''} />

                <label>Reason:</label>
                <textarea name="reason" defaultValue={referralLetter.reason || ''}></textarea>

                <label>Urgency:</label>
                <select name="urgency" defaultValue={referralLetter.urgency || ''}>
                    <option value="">Select urgency</option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                </select>

                <label>Additional Notes:</label>
                <textarea name="additionalNotes" defaultValue={referralLetter.additionalNotes || ''} />

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save Changes</button>
                    <a href={`/patientRecords/${recordId}/edit?token=${token}`} className="btn btn-secondary">← Go Back</a>
                </div>
            </form>

            {currentUser?.role === 'Doctor' && (
                <form
                    method="POST"
                    action={`/patientRecords/${referralLetter.patient._id}/deleteReferralLetter/${referralLetter._id}?token=${token}&_method=DELETE`}
                    style={{ marginTop: '20px' }}
                    onSubmit={(e) => {
                        if (!confirm('Are you sure you want to delete this referral letter?')) e.preventDefault();
                    }}
                >
                    <button type="submit" className="btn btn-danger">🗑 Delete Referral Letter</button>
                </form>
            )}
        </Layout>
    );
}

module.exports = EditReferralLetter;
