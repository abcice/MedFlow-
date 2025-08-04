const React = require('react');
const Layout = require('../layouts/Layout');

function SignIn(props) {
    return (
        <Layout>
            <div className="container">
            <h1> MedFlow Sign In</h1>

            <form action="/users/login" method="POST">
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

                {/* Submit & Alternate Sign Up Link */}
                <div>
                    <button type="submit"> Sign In</button>
                    <a href="/users"> Create Account</a>
                </div>
            </form>

            <div>
                <p>Don't have an account? <a href="/users">Sign up here</a></p>
            </div>
            </div>
        </Layout>
    );
}

module.exports = SignIn;
