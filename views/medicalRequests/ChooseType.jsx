const React = require('react');
const Layout = require('../layouts/Layout');

function ChooseType({ token }) {
    return (
        <Layout token={token}>
            <h1>🧪 Choose Request Type</h1>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <a href={`/medicalRequests/lab?token=${token}`} className="btn btn-primary">🔬 Lab Requests</a>
                <a href={`/medicalRequests/radiology?token=${token}`} className="btn btn-secondary">🩻 Radiology Requests</a>
            </div>
        </Layout>
    );
}

module.exports = ChooseType;
