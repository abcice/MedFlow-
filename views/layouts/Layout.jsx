const React = require('react');

function Layout(props) {
    return (
        <html>
            <head>
                <title>MedFlow</title>
                <link rel="stylesheet" href="/css/style.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                {/* Navigation Bar */}
                <nav>
                    <a href={`/dashboard?token=${props.token || ''}`}>🏠 Home</a>
                    <a href={`/patients?token=${props.token || ''}`}>👥 Patients</a>
                    <a href={`/appointments?token=${props.token || ''}`}>📅 Appointments</a>

                    <a href="/users/login">🔐 Login</a>
                </nav>

                {/* Main Page Content */}
                <main>
                    {props.children}
                </main>

                {/* Footer */}
                <footer>
                    <p>MedFlow &copy; {new Date().getFullYear()}</p>
                </footer>
            </body>
        </html>
    );
}

module.exports = Layout;
