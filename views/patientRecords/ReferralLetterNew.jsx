const React = require('react');
const Layout = require('../layouts/Layout');

function ReferralLetterNew({ patient, token }) {
    return (
        <Layout token={token}>
            <h1>📄 Issue Referral Letter</h1>
            <p><strong>Patient:</strong> {patient.name} ({patient.cpr})</p>

            <form action={`/patientRecords/referralLetter?token=${token}`} method="POST">
                <input type="hidden" name="patient" value={patient._id} />

                <label>Referred To (Hospital / Department):</label>
                <input type="text" name="referredTo" required />

                <label>Reason:</label>
                <textarea name="reason" required></textarea>

                <label>Urgency:</label>
                <select name="urgency" required>
                    <option value="">Select urgency</option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergency">Emergency</option>
                </select>

                <label>Additional Notes:</label>
                <textarea name="additionalNotes" />

                <button type="submit" className="btn btn-primary">💾 Save</button>
                <a href={`/patientRecords/${patient._id}/history?token=${token}`} className="btn btn-secondary">← Cancel</a>
            </form>
        </Layout>
    );
}

module.exports = ReferralLetterNew;
