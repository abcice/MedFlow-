const React = require('react');
const Layout = require('../layouts/Layout');

function History({ patient, records, token }) {
    return (
        <Layout token={token}>
            <h1>📜 Medical History of {patient.name}</h1>

            <div>
                <strong>CPR:</strong> {patient.cpr} <br />
                <strong>Phone:</strong> {patient.phone || 'N/A'} <br />
                <strong>Gender:</strong> {patient.gender}
            </div>

            <hr />

            {records.length === 0 ? (
                <p>No medical history found.</p>
            ) : (
                records.map((record, index) => (
                    <div key={record._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
                        <h3>Visit {index + 1} — {new Date(record.visitDate).toLocaleDateString()}</h3>
                        <p><strong>Doctor:</strong> Dr. {record.doctor?.name}</p>
                        <p><strong>Complaint:</strong> {record.complaint}</p>
                        <p><strong>Examination:</strong> {record.examination}</p>
                        <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                        <p><strong>Treatment Plan:</strong> {record.treatmentPlan}</p>
                        <p><strong>Private Note:</strong> {record.privateNote || 'N/A'}</p>
                    </div>
                ))
            )}

            <a href={`/patients/${patient._id}?token=${token}`} className="btn btn-secondary">
                ← Back to Patient
            </a>
        </Layout>
    );
}

module.exports = History;
