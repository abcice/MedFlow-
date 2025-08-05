const React = require('react');
const Layout = require('../layouts/Layout');

function New(props) {
    const { patient, token, currentUser, favoritePrescriptions = [] } = props;

    return (
        <Layout token={token}>
            <h1>➕ New Medical Record</h1>

            {/* Patient Info */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                    src={patient.photo} 
                    alt={`${patient.name}'s photo`} 
                    style={{ width: '120px', borderRadius: '8px' }} 
                />
                <div>
                    <h2>{patient.name}</h2>
                    <p><strong>CPR:</strong> {patient.cpr}</p>
                    <p><strong>Phone:</strong> {patient.phone || 'N/A'}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                </div>
            </div>

            {/* Medical Record Form */}
            <form action={`/patientRecords?token=${token}`} method="POST">
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

                {/* Requests Section */}
                <div style={{ marginTop: '20px' }}>
                    <h3>Requests</h3>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => window.location.href = `/patientRecords/${patient._id}/history/newRequest?type=Lab&token=${token}`}>
                        🧪 Lab Request
                    </button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => window.location.href = `/patientRecords/${patient._id}/history/newRequest?type=Radiology&token=${token}`}>
                        🩻 Radiology Request
                    </button>

                </div>

                {/* Prescriptions Section */}
                <div style={{ marginTop: '20px' }}>
                    <h3>Prescriptions</h3>

                    {/* Favorite Prescriptions */}
                    <label>Choose Favorite:</label>
                    <input type="text" placeholder="Search favorite..." id="fav-search"
                        onKeyUp={(e) => {
                            const filter = e.target.value.toLowerCase();
                            document.querySelectorAll('.fav-item').forEach(el => {
                                el.style.display = el.dataset.name.toLowerCase().includes(filter) ? '' : 'none';
                            });
                        }} />
                    <div>
                        {favoritePrescriptions.map(fav => (
                            <button type="button" 
                                key={fav._id} 
                                className="fav-item btn btn-light" 
                                data-name={fav.name}
                                onClick={() => {
                                    document.querySelector('input[name="drugName"]').value = fav.drugs[0]?.name || '';
                                    document.querySelector('input[name="dose"]').value = fav.drugs[0]?.dose || '';
                                    document.querySelector('input[name="route"]').value = fav.drugs[0]?.route || '';
                                    document.querySelector('input[name="frequency"]').value = fav.drugs[0]?.frequency || '';
                                    document.querySelector('input[name="duration"]').value = fav.drugs[0]?.duration || '';
                                }}>
                                {fav.name}
                            </button>
                        ))}
                    </div>

                    {/* Manual Prescription Entry */}
                    <input type="text" name="drugName" placeholder="Drug Name" />
                    <input type="text" name="dose" placeholder="Dose" />
                    <input type="text" name="route" placeholder="Route" />
                    <input type="text" name="frequency" placeholder="Frequency" />
                    <input type="text" name="duration" placeholder="Duration" />
                    <textarea name="notes" placeholder="Extra instructions"></textarea>
                </div>

                {/* Printables Section */}
                <div style={{ marginTop: '20px' }}>
                    <h3>Printables</h3>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => window.location.href = `/sickLeave/new?patient=${patient._id}&token=${token}`}>
                        📝 Sick Leave
                    </button>
                    <button type="button" className="btn btn-secondary"
                        onClick={() => window.location.href = `/referralLetter/new?patient=${patient._id}&token=${token}`}>
                        📄 Referral Letter
                    </button>
                </div>

                {/* Billing Section */}
                <div style={{ marginTop: '20px' }}>
                    <h3>Billing</h3>
                    <button type="button" className="btn btn-warning"
                        onClick={() => window.location.href = `/billing/new?patient=${patient._id}&token=${token}`}>
                        💰 Add Payment
                    </button>
                </div>

                {/* Buttons */}
                <div style={{ marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary">💾 Save</button>
                    <button type="button" className="btn btn-secondary"
                        onClick={(e) => {
                            if (confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
                                window.history.back();
                            }
                        }}>
                        ← Go Back
                    </button>
                </div>
            </form>
        </Layout>
    );
}

module.exports = New;
