const React = require('react');
const Layout = require('../layouts/Layout');

function SignUp(props) {
    return (
        <Layout token={props.token} hideAuthLinks={true}> {/* Hide auth links in navbar */}
            {/* Banner */}
            <div className="auth-banner-container">
                <img src="https://i.imgur.com/ML0wrCz.png" alt="Medical Banner" className="auth-banner" />
            </div>

            {/* Form Card */}
            <div className="auth-container no-overlap">
                <h1>📝 Sign Up</h1>
                <form action="/users" method="POST">
                    <label htmlFor="name">Full Name:</label>
                    <input type="text" id="name" name="name" required />

                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="">-- Select Role --</option>
                        <option value="Doctor">Doctor</option>
                        <option value="FrontDesk">Front Desk</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="LabTech">Lab Technician</option>
                        <option value="Radiologist">Radiologist</option>
                    </select>

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required />

                    <button type="submit" className="btn btn-primary">Create Account</button>
                    <a href="/users/login" className="btn btn-secondary">Login Instead</a>
                </form>
            </div>
        </Layout>
    );
}

module.exports = SignUp;
