const React = require('react');
const Layout = require('../layouts/Layout');

function EditReferralLetter({ referralLetter, token, recordId }) {
    return (
        <Layout token={token}>
            <h1>✏️ Edit Referral Letter</h1>
            <form
                action={`/patientRecords/${referralLetter.patient._id}/editReferralLetter/${referralLetter._id}?token=${token}&recordId=${recordId}`}
                method="POST"
            >
                <label>Referred To:</label>
                <input type="text" name="referredTo" defaultValue={referralLetter.referredTo} />

                <label>Reason:</label>
                <textarea name="reason" defaultValue={referralLetter.reason}></textarea>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save</button>
                </div>
            </form>
        </Layout>
    );
}

module.exports = EditReferralLetter;
