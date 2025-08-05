const React = require('react');
const Layout = require('../layouts/Layout');

function NewRequest({ patient, token, type, currentUser }) {
    return (
        <Layout token={token}>
            <h1>➕ New {type} Request</h1>
            <p><strong>Patient:</strong> {patient.name} ({patient.cpr})</p>

            <form action={`/patientRecords/${patient._id}/history/newRequest?type=${type}&token=${token}`} method="POST">
                <label>Details:</label>
                <textarea name="details" required></textarea>

                <button type="submit" className="btn btn-primary">💾 Save</button>
                <button type="button" className="btn btn-secondary"
                    onClick={() => window.history.back()}>
                    ← Cancel
                </button>
            </form>
        </Layout>
    );
}

module.exports = NewRequest;
