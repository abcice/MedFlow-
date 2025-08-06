const React = require('react');
const Layout = require('../layouts/Layout');

function RequestDetail({ request, userRole, token, type }) {
    return (
        <Layout token={token}>
            <h2>{type} Request Details</h2>
            <p><strong>Patient:</strong> {request.patient.name}</p>
            <p><strong>Doctor:</strong> {request.doctor.name}</p>
            <p><strong>Status:</strong> {request.status || 'Pending'}</p>

            {userRole === 'LabTech' || userRole === 'Radiologist' ? (
                <form method="POST" action={`/medicalRequests/${type}/${request._id}?token=${token}`} encType="multipart/form-data">
                    <label>Status:</label>
                    <select name="status" defaultValue={request.status || 'Pending'}>
                        <option>Pending</option>
                        <option>Complete</option>
                    </select>

                    {type === 'Lab' && (
                        <>
                            <label>Result Text:</label>
                            <textarea name="resultText">{request.resultText || ''}</textarea>
                        </>
                    )}

                    <label>Upload Result Files:</label>
                    <input type="file" name="resultFiles" multiple />

                    <button type="submit">Update</button>
                </form>
            ) : null}

            {userRole === 'Doctor' && (
                <form method="POST" action={`/medicalRequests/${type}/${request._id}/delete?token=${token}`} onSubmit="return confirm('Are you sure?')">
                    <button type="submit">Delete</button>
                </form>
            )}

            <a href={`/medicalRequests/${type.toLowerCase()}?token=${token}`}>Go Back</a>
        </Layout>
    );
}
module.exports = RequestDetail;
