const React = require('react');
const Layout = require('../layouts/Layout');

function SickLeaveOfficial({ sickLeave, token }) {
    return (
        <Layout token={token}>
            <div className="container mt-4">
                <h1 className="mb-4">📝 Sick Leave Certificate</h1>

                <div className="mb-3">
                    <button 
                        id="print-btn"
                        className="btn btn-primary me-2"
                    >
                        🖨 Print
                    </button>

                    <a 
                        href={`/medicalRequests/sickLeaves/${sickLeave._id}/pdf?token=${token}`} 
                        className="btn btn-secondary"
                    >
                        📥 Download PDF
                    </a>
                </div>

                <div style={{ padding: '20px', border: '1px solid #ccc', background: '#fff' }}>
                    <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Medical Certificate</h2>
                    <p><strong>Full Name:</strong> {sickLeave.patient?.name}</p>
                    <p><strong>CPR / ID Number:</strong> {sickLeave.patient?.cpr}</p>
                    <p><strong>Date of Birth:</strong> {sickLeave.patient?.dob || '-'}</p>
                    <p><strong>Gender:</strong> {sickLeave.patient?.gender || '-'}</p>
                    <p><strong>Occupation:</strong> {sickLeave.patient?.occupation || '-'}</p>
                    <p><strong>Date of Examination:</strong> {sickLeave.createdAt ? new Date(sickLeave.createdAt).toLocaleDateString() : '-'}</p>
                    <p><strong>Diagnosis:</strong> {sickLeave.reason || '-'}</p>
                    <p><strong>From:</strong> {sickLeave.startDate || '-'} &nbsp; <strong>To:</strong> {sickLeave.endDate || '-'}</p>
                    <p><strong>Total Days:</strong> {sickLeave.durationDays || '-'}</p>
                    <p><strong>Additional Notes:</strong> {sickLeave.notes || '-'}</p>
                    <br />
                    <p><strong>Physician’s Name:</strong> Dr. {sickLeave.doctor?.name}</p>
                    <p><strong>License Number:</strong> {sickLeave.doctor?.licenseNumber || '-'}</p>
                    <p><strong>Signature:</strong> _____________________</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Clinic Stamp:</strong> _____________________</p>
                </div>
            </div>

            <script src="/js/print.js"></script>
        </Layout>
    );
}

module.exports = SickLeaveOfficial;
