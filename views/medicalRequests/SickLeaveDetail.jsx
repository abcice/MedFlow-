const React = require('react');
const Layout = require('../layouts/Layout');

function SickLeaveDetail({ sickLeave, token, userRole }) {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById('print-sick-leave');
        import('html2pdf.js').then(html2pdf => {
            html2pdf.default().from(element).save(`SickLeave_${sickLeave.patient?.name || 'Patient'}.pdf`);
        });
    };

    const [showForm, setShowForm] = React.useState(false);

    return (
        <Layout token={token}>
            <h1>📝 Sick Leave Details</h1>
            <p><strong>Patient:</strong> {sickLeave.patient?.name}</p>
            <p><strong>Doctor:</strong> {sickLeave.doctor?.name}</p>
            <p><strong>Reason:</strong> {sickLeave.reason || '-'}</p>
            <p><strong>Duration:</strong> {sickLeave.durationDays || '-'} days</p>

            {userRole === 'Doctor' && (
                <form
                    method="POST"
                    action={`/medicalRequests/sickLeaves/${sickLeave._id}?_method=DELETE&token=${token}`}
                    onSubmit={(e) => { if (!confirm('Delete this sick leave?')) e.preventDefault(); }}
                >
                    <button type="submit" className="btn btn-danger mt-2">Delete</button>
                </form>
            )}

            <button className="btn btn-info mt-4" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Official Form' : 'View Official Form'}
            </button>

            {showForm && (
                <>
                    <div id="print-sick-leave" style={{ border: '1px solid #000', padding: '20px', marginTop: '15px' }}>
                        <h2 style={{ textAlign: 'center' }}>🏥 {sickLeave.clinicName || 'Clinic/Hospital Name'}</h2>
                        <h3 style={{ textAlign: 'center' }}>Medical Certificate</h3>
                        <br />

                        <p><strong>Full Name:</strong> {sickLeave.patient?.name}</p>
                        <p><strong>CPR / ID Number:</strong> {sickLeave.patient?.cpr}</p>
                        <p><strong>Date of Birth:</strong> {sickLeave.patient?.dob || ''} &nbsp; <strong>Gender:</strong> {sickLeave.patient?.gender || ''}</p>
                        <p><strong>Occupation:</strong> {sickLeave.patient?.occupation || ''}</p>
                        <br />

                        <p><strong>Date of Examination:</strong> {new Date(sickLeave.createdAt).toLocaleDateString()}</p>
                        <p><strong>Diagnosis:</strong> {sickLeave.reason}</p>
                        <p><strong>Unfit from:</strong> {sickLeave.fromDate || ''} &nbsp; <strong>To:</strong> {sickLeave.toDate || ''}</p>
                        <p><strong>Total Days:</strong> {sickLeave.durationDays} days</p>
                        <p><strong>Additional Notes:</strong> {sickLeave.notes || ''}</p>
                        <br />

                        <p><strong>Name:</strong> Dr. {sickLeave.doctor?.name} </p>
                        <p><strong>License Number:</strong> {sickLeave.doctor?.licenseNumber || ''}</p>
                        <br />

                        <p>Signature: ______________________ &nbsp; Date: {new Date().toLocaleDateString()}</p>
                        <p>Clinic Stamp:</p>
                    </div>

                    <div className="mt-3">
                        <button className="btn btn-primary" onClick={handlePrint}>🖨 Print</button>
                        <button className="btn btn-secondary ms-2" onClick={handleDownloadPDF}>⬇ Download PDF</button>
                    </div>
                </>
            )}

            <a href={`/medicalRequests/sickLeaves?token=${token}`} className="btn btn-secondary mt-3 ms-2">← Go Back</a>
        </Layout>
    );
}

module.exports = SickLeaveDetail;
