const React = require('react');
const Layout = require('../layouts/Layout');

function Index(props) {
    const patients = props.patients;

    return (
        <Layout>
            <h1>🏥 All Patients</h1>

            <div className="d-flex justify-between align-center mb-3">
                <h2>Registered Patients</h2>
                <a href={`/patients/new?token=${props.token}`} className="btn btn-primary">
                    ➕ Add New Patient
                </a>
            </div>

            {patients.length === 0 ? (
                <div className="text-center">
                    <p>No patients registered yet! Add your first patient to get started.</p>
                    <a href={`/patients/new?token=${props.token}`} className="btn btn-primary">
                        Add Your First Patient
                    </a>
                </div>
            ) : (
                <div className="patients-grid">
                    {patients.map((patient) => (
                        <div key={patient._id} className="patient-card">
                            {/* Patient Photo */}
                            <div>
                                <img 
                                    src={patient.photo} 
                                    alt={`${patient.name}'s photo`} 
                                    width="100"
                                />
                            </div>

                            {/* Basic Info */}
                            <div className="patient-name">{patient.name}</div>
                            <div className="patient-cpr">CPR: {patient.cpr}</div>
                            <div className="patient-age">Age: {patient.age}</div>
                            <div className="patient-gender">Gender: {patient.gender}</div>

                            {/* Action Buttons */}
                            <div className="d-flex gap-2 mt-2">
                                <a href={`/patients/${patient._id}?token=${props.token}`} className="btn btn-secondary">
                                    👁️ View
                                </a>
                                <a href={`/patients/${patient._id}/edit?token=${props.token}`} className="btn btn-primary">
                                    ✏️ Edit
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
}

module.exports = Index;
