const React = require('react');
const Layout = require('../layouts/Layout');

function Show(props) {
    const { patient, records, token } = props;

    return (
        <Layout token={token}>
            <h1>🩺 {patient.name} - Medical History</h1>
            <p><strong>CPR:</strong> {patient.cpr}</p>
            {patient.photo && (
                <img 
                    src={patient.photo} 
                    alt="Patient" 
                    style={{ width: '120px', borderRadius: '8px' }} 
                />
            )}

            {/* Buttons above the history */}
            <div style={{ marginBottom: '15px' }}>
                <a 
                    href={`/patientRecords/${patient._id}/history/new?token=${token}`} 
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                >
                    ➕ Add New Visit
                </a>

                <a 
                    href={`/patients/${patient._id}?token=${token}`} 
                    className="btn btn-secondary"
                >
                    ← Go Back
                </a>
            </div>

            {records.length === 0 ? (
                <p>No records yet.</p>
            ) : (
                records.map((rec) => (
                    <div key={rec._id} className="card" style={{ marginTop: '15px', padding: '10px' }}>
                        <h3>Visit: {new Date(rec.visitDate).toLocaleDateString()}</h3>
                        <p><strong>Doctor:</strong> Dr. {rec.doctor?.name}</p>
                        <p><strong>Complaint:</strong> {rec.complaint}</p>
                        <p><strong>Examination:</strong> {rec.examination}</p>
                        <p><strong>Diagnosis:</strong> {rec.diagnosis}</p>
                        <p><strong>Treatment Plan:</strong> {rec.treatmentPlan}</p>

                        <h4>Prescriptions</h4>
                        {rec.prescriptions.map(p => (
                            <p key={p._id}>{p.medicineName} - {p.dosage}</p>
                        ))}

                        <h4>Lab Requests</h4>
                        {rec.labRequests.map(l => (
                            <p key={l._id}>{l.testName}</p>
                        ))}

                        <h4>Radiology Requests</h4>
                        {rec.radiologyRequests.map(r => (
                            <p key={r._id}>{r.testName}</p>
                        ))}

                        {rec.privateNote && (
                            <p style={{ color: 'red' }}><strong>Private Note:</strong> {rec.privateNote}</p>
                        )}

                        {/* Edit button for each record */}
                        <div style={{ marginTop: '10px' }}>
                            <a 
                                href={`/patientRecords/${rec._id}/edit?token=${token}`} 
                                className="btn btn-warning"
                            >
                                ✏️ Edit This Visit
                            </a>
                        </div>
                    </div>
                ))
            )}
        </Layout>
    );
}

module.exports = Show;
