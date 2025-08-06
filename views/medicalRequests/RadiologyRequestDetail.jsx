const React = require('react');
const Layout = require('../layouts/Layout');

function RadiologyRequestDetail({ token, request, userRole }) {
    return (
        <Layout token={token}>
            <h1>🩻 Radiology Request Details</h1>
            <p><strong>Patient:</strong> {request.patient?.name}</p>
            <p><strong>Doctor:</strong> {request.doctor?.name}</p>
            <p><strong>Status:</strong> {request.status || 'Pending'}</p>

            {userRole === 'Radiologist' && (
                <form method="POST" encType="multipart/form-data">
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

            <a href={`/medicalRequests/radiology?token=${token}`} className="btn btn-secondary">← Go Back</a>
        </Layout>
    );
}

module.exports = RadiologyRequestDetail;
