const React = require('react');

function Layout(props) {
    const isLoggedIn = !!props.token;

    return (
        <html>
            <head>
                <title>MedFlow</title>

                {/* Favicon */}
                <link rel="icon" href="https://i.imgur.com/kNfecFU.png" type="image/png" />

                {/* Styles */}
                <link rel="stylesheet" href="/styles.css" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />

                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                {/* Navigation Bar */}
                <nav className="navbar">
                    {/* Logo on the left */}
                    <div className="navbar-left">
                        <a href={isLoggedIn ? `/dashboard?token=${props.token}` : '/users/login'}>
                            <img src="https://i.imgur.com/kNfecFU.png" alt="MedFlow Logo" className="logo" />
                        </a>
                    </div>

                    {/* Navigation Links */}
                    <div className="navbar-links">
                        {isLoggedIn && <a href={`/patients?token=${props.token}`}>👥 Patients</a>}
                        {isLoggedIn && <a href={`/appointments?token=${props.token}`}>📅 Appointments</a>}

                        {!props.hideAuthLinks && (
                            isLoggedIn ? (
                                <a href="/users/logout" className="logout-btn">🔓 Logout</a>
                            ) : (
                                <a href="/users/login">🔐 Login</a>
                            )
                        )}

                    </div>
                </nav>

                {/* Main Content */}
                <main className="container">
                    {props.children}
                </main>

                {/* Footer */}
                <footer style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                    <p>MedFlow &copy; {new Date().getFullYear()}</p>
                </footer>
            </body>
        </html>
    );
}

module.exports = Layout;
