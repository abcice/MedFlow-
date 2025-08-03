const React = require('react');
const Layout = require('../layouts/Layout');

function Show(props) {
    const patient = props.patient;

    return (
        <Layout patient={patient}>
            <h1>🏥 {patient.name}</h1>

            <div className="patient-card">
                {/* Patient Photo */}
                <div>
                    <img 
                        src={patient.photo} 
                        alt={`${patient.name}'s photo`} 
                        width="150"
                    />
                </div>

                {/* Patient Basic Info */}
                <div><strong>CPR:</strong> {patient.cpr}</div>
                <div><strong>Age:</strong> {patient.age}</div>
                <div><strong>Gender:</strong> {patient.gender}</div>
                <div><strong>Phone:</strong> {patient.phone || 'N/A'}</div>
                <div><strong>Address:</strong> {patient.address || 'N/A'}</div>
                <div><strong>Payment Type:</strong> {patient.paymentType}</div>
                {patient.paymentType === 'Insurance' && (
                    <div><strong>Insurance Provider:</strong> {patient.insuranceProvider || 'N/A'}</div>
                )}
                <div><strong>Notes:</strong> {patient.notes || 'None'}</div>

                {/* Navigation Buttons */}
                <div className="d-flex gap-2 mt-3">
                    <a href={`/patients?token=${props.token}`} className="btn btn-secondary">
                        ← Back to All Patients
                    </a>
                    <a href={`/patients/${patient._id}/edit?token=${props.token}`} className="btn btn-primary">
                        ✏️ Edit {patient.name}
                    </a>
                </div>

                {/* Delete Form */}
                <div className="mt-3">
                    <form action={`/patients/${patient._id}?_method=DELETE&token=${props.token}`} method="POST">
                        <button type="submit" className="btn btn-danger">
                            🗑️ Delete {patient.name}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

module.exports = Show;
