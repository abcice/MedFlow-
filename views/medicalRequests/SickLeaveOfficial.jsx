const React = require('react');
const Layout = require('../layouts/Layout');

function SickLeaveOfficial({ sickLeave, token }) {
    const issuedDate = new Date(sickLeave.createdAt).toLocaleDateString();

    return (
        <Layout token={token}>
            <div className="container mt-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                <h1 className="text-center mb-4">🏥 Medical Certificate</h1>

                <div className="mb-3 d-print-none">
                    <a 
                        href={`/medicalRequests/sickLeaves/${sickLeave._id}/official/download?token=${token}`} 
                        className="btn btn-secondary me-2"
                    >
                        📥 Download PDF
                    </a>
                    <button 
                        onClick={() => window.print()} 
                        className="btn btn-primary"
                    >
                        🖨 Print
                    </button>
                </div>

                <div className="border p-4 bg-white" id="official-sickleave">
                    <p><strong>Full Name:</strong> {sickLeave.patient?.name}</p>
                    <p><strong>CPR / ID Number:</strong> {sickLeave.patient?.cpr}</p>
                    <p><strong>Date of Birth:</strong> {sickLeave.patient?.dob || '-'}</p>
                    <p><strong>Gender:</strong> {sickLeave.patient?.gender}</p>
                    <p><strong>Occupation:</strong> {sickLeave.patient?.occupation || '-'}</p>

                    <p className="mt-4">This is to certify that the above-named patient was examined at our clinic on:</p>
                    <p><strong>Date of Examination:</strong> {issuedDate}</p>

                    <p><strong>Diagnosis:</strong> {sickLeave.reason}</p>
                    <p>The patient is medically unfit to attend work/school for the following period:</p>
                    <p><strong>From:</strong> {new Date(sickLeave.startDate).toLocaleDateString()} &nbsp;
                       <strong>To:</strong> {new Date(sickLeave.endDate).toLocaleDateString()}</p>
                    <p><strong>Total Days:</strong> {sickLeave.durationDays}</p>

                    <p><strong>Additional Notes:</strong> {sickLeave.notes || '-'}</p>

                    <hr />
                    <p><strong>Physician Name:</strong> Dr. {sickLeave.doctor?.name}</p>
                    <p><strong>License Number:</strong> {sickLeave.doctor?.licenseNumber || '-'}</p>
                    <p><strong>Signature:</strong> _____________________</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Clinic Stamp:</strong> _____________________</p>
                </div>
            </div>
        </Layout>
    );
}

module.exports = SickLeaveOfficial;
