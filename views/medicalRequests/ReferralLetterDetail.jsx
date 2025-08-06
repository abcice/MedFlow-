const React = require('react');
const Layout = require('../layouts/Layout');

function ReferralLetterDetail({ letter, token, userRole }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('print-referral-letter');
        import('html2pdf.js').then(html2pdf => {
            html2pdf.default().from(element).save(`ReferralLetter_${letter.patient?.name || 'Patient'}.pdf`);
        });
    };

    const [showForm, setShowForm] = React.useState(false);

    return (
        <Layout token={token}>
            <h1>📄 Referral Letter Details</h1>
            <p><strong>Patient:</strong> {letter.patient?.name}</p>
            <p><strong>Doctor:</strong> {letter.doctor?.name}</p>
            <p><strong>Referred To:</strong> {letter.referredTo || '-'}</p>
            <p><strong>Reason:</strong> {letter.reason || '-'}</p>

            {userRole === 'Doctor' && (
                <form
                    method="POST"
                    action={`/medicalRequests/referralLetters/${letter._id}?_method=DELETE&token=${token}`}
                    onSubmit={(e) => { if (!confirm('Delete this referral letter?')) e.preventDefault(); }}
                >
                    <button type="submit" className="btn btn-danger mt-2">Delete</button>
                </form>
            )}

            <button className="btn btn-info mt-4" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Official Form' : 'View Official Form'}
            </button>

            {showForm && (
                <>
                    <div id="print-referral-letter" style={{ border: '1px solid #000', padding: '20px', marginTop: '15px' }}>
                        <h2 style={{ textAlign: 'center' }}>🏥 {letter.clinicName || 'Clinic/Hospital Name'}</h2>
                        <h3 style={{ textAlign: 'center' }}>Referral Letter</h3>
                        <br />

                        <p><strong>Date:</strong> {new Date(letter.createdAt).toLocaleDateString()}</p>
                        <p><strong>To:</strong> Dr. {letter.referredTo}</p>
                        <p><strong>Specialty:</strong> {letter.specialty || ''}</p>
                        <p><strong>Facility / Hospital:</strong> {letter.facility || ''}</p>
                        <p><strong>Address:</strong> {letter.address || ''}</p>
                        <p><strong>Phone:</strong> {letter.phone || ''} &nbsp; <strong>Fax:</strong> {letter.fax || ''}</p>
                        <br />

                        <p><strong>Full Name:</strong> {letter.patient?.name}</p>
                        <p><strong>CPR / ID Number:</strong> {letter.patient?.cpr}</p>
                        <p><strong>Date of Birth:</strong> {letter.patient?.dob || ''} &nbsp; <strong>Gender:</strong> {letter.patient?.gender || ''}</p>
                        <p><strong>Contact Number:</strong> {letter.patient?.phone}</p>
                        <br />

                        <p><strong>Reason for Referral:</strong> {letter.reason}</p>
                        <p><strong>Clinical Summary / Medical History:</strong> {letter.clinicalSummary || ''}</p>
                        <p><strong>Provisional Diagnosis:</strong> {letter.diagnosis || ''}</p>
                        <br />

                        <p><strong>Referring Physician:</strong> Dr. {letter.doctor?.name}</p>
                        <p><strong>Clinic Name:</strong> {letter.clinicName || ''}</p>
                        <p><strong>License Number:</strong> {letter.doctor?.licenseNumber || ''}</p>
                        <br />

                        <p>Signature: ____________________ &nbsp; Date: {new Date().toLocaleDateString()}</p>
                        <p>Clinic Stamp:</p>
                    </div>

                    <div className="mt-3">
                        <button className="btn btn-primary" onClick={handlePrint}>🖨 Print</button>
                        <button className="btn btn-secondary ms-2" onClick={handleDownloadPDF}>⬇ Download PDF</button>
                    </div>
                </>
            )}

            <a href={`/medicalRequests/referralLetters?token=${token}`} className="btn btn-secondary mt-3 ms-2">← Go Back</a>
        </Layout>
    );
}

module.exports = ReferralLetterDetail;
