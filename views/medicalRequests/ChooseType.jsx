const React = require('react');
const Layout = require('../layouts/Layout');

function ChooseType({ token }) {
    return (
        <Layout token={token}>
            <h1>📋 Requests Management</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px' }}>
                <a href={`/medicalRequests/lab?token=${token}`} className="btn btn-primary">🧪 Lab Requests</a>
                <a href={`/medicalRequests/radiology?token=${token}`} className="btn btn-primary">🩻 Radiology Requests</a>
                <a href={`/medicalRequests/sickLeaves?token=${token}`} className="btn btn-primary">📝 Sick Leaves</a>
                <a href={`/medicalRequests/referralLetters?token=${token}`} className="btn btn-primary">📄 Referral Letters</a>
            </div>
        </Layout>
    );
}
module.exports = ChooseType;
