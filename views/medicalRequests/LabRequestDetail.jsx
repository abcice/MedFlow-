const React = require('react');
const Layout = require('../layouts/Layout');

function LabRequestDetail({ token, request, userRole }) {
    return (
        <Layout token={token}>
            <h1>🔬 Lab Request Details</h1>
            <p><strong>Patient:</strong> {request.patient?.name}</p>
            <p><strong>Doctor:</strong> {request.doctor?.name}</p>
            <p><strong>Status:</strong> {request.status || 'Pending'}</p>

            {userRole === 'LabTech' && (
                <form method="POST" encType="multipart/form-data">
                    <label>Test Results:</label>
                    <textarea name="resultText" defaultValue={request.resultText || ''}></textarea>

                    <label>Upload Files:</label>
                    <input type="file" name="resultFiles" multiple />

                    <label>Status:</label>
                    <select name="status" defaultValue={request.status || 'Pending'}>
                        <option value="Pending">Pending</option>
                        <option value="Complete">Complete</option>
                    </select>

                    <button type="submit" className="btn btn-success">Save</button>
                </form>
            )}

            {userRole === 'Doctor' && (
                <form method="POST" action={`/medicalRequests/lab/${request._id}?_method=DELETE&token=${token}`} onSubmit={(e) => { if (!confirm('Delete this request?')) e.preventDefault(); }}>
                    <button type="submit" className="btn btn-danger mt-2">Delete</button>
                </form>
            )}

            <a href={`/medicalRequests/lab?token=${token}`} className="btn btn-secondary mt-3">← Go Back</a>
        </Layout>
    );
}

module.exports = LabRequestDetail;
