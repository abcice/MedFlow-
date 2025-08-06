const React = require('react');
const Layout = require('../layouts/Layout');

function New(props) {
    const { patient, token, currentUser, favoritePrescriptions = [] } = props;

    return (
        <Layout token={token}>
            <h1>➕ New Medical Record</h1>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                {patient.photo && (
                    <img src={patient.photo} alt={`${patient.name}'s photo`} style={{ width: '120px', borderRadius: '8px' }} />
                )}
                <div>
                    <h2>{patient.name}</h2>
                    <p><strong>CPR:</strong> {patient.cpr}</p>
                    <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    {patient.blacklisted && <p style={{ color: 'red' }}>🚫 Blacklisted</p>}
                </div>
            </div>

            <form action={`/patientRecords/saveDraft?token=${token}`} method="POST">
                <input type="hidden" name="patient" value={patient._id} />
                <input type="hidden" name="doctor" value={currentUser._id} />

                <label>Doctor:</label>
                <input type="text" value={currentUser.name} disabled />

                <label>Complaint:</label>
                <textarea name="complaint"></textarea>

                <label>Examination:</label>
                <textarea name="examination"></textarea>

                <label>Diagnosis:</label>
                <textarea name="diagnosis"></textarea>

                <label>Treatment Plan:</label>
                <textarea name="treatmentPlan"></textarea>

                {/* Request Buttons */}
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" name="action" value="Lab" className="btn btn-secondary">🧪 Lab Request</button>
                    <button type="submit" name="action" value="Radiology" className="btn btn-secondary">🩻 Radiology Request</button>
                </div>
                                {/* Prescriptions Section */}
                <div style={{ marginTop: '20px' }}>
                    <h3>Prescriptions</h3>

                    {/* Button to go to favorites */}
                    <button
                        type="submit"
                        name="action"
                        value="Favorites"
                        className="btn btn-info"
                    >
                        ⭐ Favorites
                    </button>

                    <input type="text" name="drugName" placeholder="Drug Name" defaultValue={props.prescriptionData?.drugName || ''} />
                    <input type="text" name="dose" placeholder="Dose" defaultValue={props.prescriptionData?.dose || ''} />
                    <input type="text" name="route" placeholder="Route" defaultValue={props.prescriptionData?.route || ''} />
                    <input type="text" name="frequency" placeholder="Frequency" defaultValue={props.prescriptionData?.frequency || ''} />
                    <input type="text" name="duration" placeholder="Duration" defaultValue={props.prescriptionData?.duration || ''} />
                    <textarea name="notes" placeholder="Extra instructions" defaultValue={props.prescriptionData?.notes || ''}></textarea>

                </div>
                {/* Printable Buttons */}
                 <div style={{ marginTop: '20px' }}>
                    <button type="submit" name="action" value="SickLeave" className="btn btn-secondary">📝 Sick Leave</button>
                    <button type="submit" name="action" value="ReferralLetter" className="btn btn-secondary">📄 Referral Letter</button>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <button type="submit" name="action" value="SaveOnly" className="btn btn-primary">💾 Save</button>
                    <a href={`/patientRecords/${patient._id}/history?token=${token}`} className="btn btn-secondary">← Go Back</a>
                </div>
            </form>
        </Layout>
    );
}

module.exports = New;
