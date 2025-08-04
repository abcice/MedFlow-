const React = require('react');
const Layout = require('../layouts/Layout.jsx');

function SignUp(props) {
    return (
        <Layout>
            <div className="container">

            <h1>📝 MedFlow Sign Up</h1>

            <form action="/users" method="POST">
                {/* Full Name */}
                <div>
                    <label htmlFor="name">Full Name:</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name" 
                        placeholder="Enter your full name..."
                        required 
                    />
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username"
                        name="username" 
                        placeholder="Enter your username..."
                        required 
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password"
                        name="password" 
                        placeholder="Enter your password..."
                        required 
                    />
                </div>

                {/* Role Selection */}
                <div>
                    <label htmlFor="role">Role:</label>
                    <select name="role" id="role" required>
                        <option value="">-- Select Role --</option>
                        <option value="Doctor">Doctor</option>
                        <option value="FrontDesk">Front Desk</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="LabTech">Lab Technician</option>
                        <option value="Radiologist">Radiologist</option>
                    </select>
                </div>

                {/* Submit & Alternate Login Link */}
                <div>
                    <button type="submit">📝 Create Account</button>
                    <a href="/users/login">🔐 Sign In Instead</a>
                </div>
            </form>

            <div>
                <p>Already have an account? <a href="/users/login">Sign in here</a></p>
            </div>
            </div>
        </Layout>
    );
}

module.exports = SignUp;
