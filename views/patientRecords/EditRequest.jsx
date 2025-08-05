const React = require('react');
const Layout = require('../layouts/Layout');

function EditRequest({ request, token, recordId }) {
    return (
        <Layout token={token}>
            <h1>✏️ Edit {request.type} Request</h1>
            <form
                action={`/patientRecords/${request.patient._id}/editRequest/${request._id}?token=${token}&recordId=${recordId}`}
                method="POST"
            >
                <label>Details:</label>
                <textarea name="details" defaultValue={request.details}></textarea>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save</button>
                </div>
            </form>
        </Layout>
    );
}

module.exports = EditRequest;
