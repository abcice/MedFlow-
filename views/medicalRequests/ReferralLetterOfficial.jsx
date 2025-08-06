// views/medicalRequests/ReferralLetterOfficial.jsx
const React = require('react');
const Layout = require('../layouts/Layout');

function ReferralLetterOfficial({ letter, token }) {
    return (
        <Layout token={token}>
            <div className="container mt-4">
                <h1 className="mb-4">📄 Referral Letter</h1>

                <div className="mb-3">
                    <a href={`/medicalRequests/referralLetters/${letter._id}/pdf?token=${token}`} className="btn btn-secondary me-2">📥 Download PDF</a>
                    <a href={`/medicalRequests/referralLetters/${letter._id}/pdf?token=${token}&print=true`} target="_blank" className="btn btn-primary">🖨 Print</a>
                </div>

                <div id="official-referral" style={{ padding: '20px', border: '1px solid #ccc', background: '#fff' }}>
                    <h2 style={{ textAlign: 'center', textDecoration: 'underline' }}>Referral Letter</h2>
                    <p><strong>Date:</strong> {new Date(letter.issuedDate).toLocaleDateString()}</p>

                    <p><strong>To:</strong> Dr. {letter.referredTo || '-'}</p>
                    <p><strong>Specialty:</strong> {letter.specialty || '-'}</p>
                    <p><strong>Facility/Hospital:</strong> {letter.facility || '-'}</p>
                    <p><strong>Address:</strong> {letter.address || '-'}</p>
                    <p><strong>Phone:</strong> {letter.phone || '-'}</p>

                    <h4>Patient Details:</h4>
                    <p><strong>Full Name:</strong> {letter.patient?.name}</p>
                    <p><strong>CPR / ID:</strong> {letter.patient?.cpr}</p>
                    <p><strong>DOB:</strong> {letter.patient?.dob || '-'}</p>
                    <p><strong>Gender:</strong> {letter.patient?.gender || '-'}</p>
                    <p><strong>Contact:</strong> {letter.patient?.phone || '-'}</p>

                    <h4>Reason for Referral:</h4>
                    <p>{letter.reason || '-'}</p>

                    <h4>Clinical Summary:</h4>
                    <p>{letter.clinicalSummary || '-'}</p>

                    <h4>Diagnosis / Findings:</h4>
                    <p>{letter.diagnosis || '-'}</p>

                    <h4>Tests Done:</h4>
                    <p>{letter.tests || '-'}</p>

                    <br />
                    <p><strong>Referring Physician:</strong> Dr. {letter.doctor?.name}</p>
                    <p><strong>Clinic Name:</strong> {letter.clinicName || '-'}</p>
                    <p><strong>License Number:</strong> {letter.licenseNumber || '-'}</p>
                    <p><strong>Signature:</strong> ____________________</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Clinic Stamp:</strong> ____________________</p>
                </div>
            </div>
        </Layout>
    );
}

module.exports = ReferralLetterOfficial;
