const React = require('react');
const Layout = require('../layouts/Layout');

function SignIn(props) {
    return (
        <Layout page="login" token={props.token} hideAuthLinks={true}> {/* Hide login link in navbar */}
            {/* Banner */}
            <div className="auth-banner-container">
                <img src="https://i.imgur.com/ML0wrCz.png" alt="Medical Banner" className="auth-banner" />
            </div>

            {/* Login Form */}
            <div className="auth-container no-overlap">
                <h1> Sign In</h1>
                <form action="/users/login" method="POST">
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />

                    <button type="submit" className="btn btn-primary">Sign In</button>
                    <a href="/users" className="btn btn-secondary">Create Account</a>
                </form>
            </div>
        </Layout>
    );
}

module.exports = SignIn;
