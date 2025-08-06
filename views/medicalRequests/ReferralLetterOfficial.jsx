const React = require('react');
const Layout = require('../layouts/Layout');

function ReferralLetterOfficial({ letter, token }) {
    return (
        <Layout token={token}>
            <div className="container mt-4">
                <h1 className="mb-4">📄 Referral Letter</h1>

                <div className="mb-3">
                    <button 
                        id="print-btn"
                        className="btn btn-primary me-2"
                    >
                        🖨 Print
                    </button>

                    <a 
                        href={`/medicalRequests/referralLetters/${letter._id}/pdf?token=${token}`} 
                        className="btn btn-secondary"
                    >
                        📥 Download PDF
                    </a>
                </div>

                <div style={{ padding: '20px', border: '1px solid #ccc', background: '#fff' }}>
                    <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Referral Letter</h2>
                    <p><strong>Date:</strong> {letter.createdAt ? new Date(letter.createdAt).toLocaleDateString() : '-'}</p>
                    <p><strong>To:</strong> Dr. {letter.referredTo || '-'}</p>
                    <p><strong>Specialty:</strong> {letter.specialty || '-'}</p>
                    <p><strong>Facility/Hospital:</strong> {letter.facility || '-'}</p>
                    <p><strong>Address:</strong> {letter.address || '-'}</p>
                    <p><strong>Phone:</strong> {letter.phone || '-'}</p>
                    <h4>Patient Details:</h4>
                    <p><strong>Full Name:</strong> {letter.patient?.name}</p>
                    <p><strong>CPR / ID Number:</strong> {letter.patient?.cpr}</p>
                    <p><strong>Date of Birth:</strong> {letter.patient?.dob || '-'}</p>
                    <p><strong>Gender:</strong> {letter.patient?.gender || '-'}</p>
                    <p><strong>Contact Number:</strong> {letter.patient?.phone || '-'}</p>
                    <h4>Reason for Referral:</h4>
                    <p>{letter.reason || '-'}</p>
                    <h4>Clinical Summary / Medical History:</h4>
                    <p>{letter.clinicalSummary || '-'}</p>
                    <h4>Provisional Diagnosis / Relevant Findings:</h4>
                    <p>{letter.diagnosis || '-'}</p>
                    <h4>Tests Done / Attached Reports:</h4>
                    <p>{letter.tests || '-'}</p>
                    <br />
                    <p><strong>Referring Physician:</strong> Dr. {letter.doctor?.name}</p>
                    <p><strong>Clinic Name:</strong> {letter.doctor?.clinicName || '-'}</p>
                    <p><strong>License Number:</strong> {letter.doctor?.licenseNumber || '-'}</p>
                    <p><strong>Signature:</strong> _____________________</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Clinic Stamp:</strong> _____________________</p>
                </div>
            </div>

            <script src="/js/print.js"></script>
        </Layout>
    );
}

module.exports = ReferralLetterOfficial;
