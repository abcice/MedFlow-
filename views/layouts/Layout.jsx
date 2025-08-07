const React = require('react');

function Layout(props) {
    const isLoggedIn = !!props.token;

    // Hide navbar on login & signup pages
    const hideNavbar =
        props.hideNavbar || 
        (props.page && (props.page === 'login' || props.page === 'signup'));

    return (
        <html>
            <head>
                <title>MedFlow</title>
                <link rel="stylesheet" href="/styles.css" />
                <link rel="stylesheet" href="/css/react-big-calendar.css" />

                {/* Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Open+Sans:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                {/* Navbar (hidden on auth pages) */}
                {!hideNavbar && (
                    <nav className="navbar">
                        <div className="navbar-left">
                            {/* Logo */}
                            <a href={isLoggedIn ? `/dashboard?token=${props.token}` : '/users/login'}>
                                <img src="https://i.imgur.com/kNfecFU.png" alt="MedFlow Logo" className="logo" />
                            </a>

                            {/* Links */}
                            <div className="navbar-links">
                                <a href={isLoggedIn ? `/dashboard?token=${props.token}` : '/users/login'}>🏠 Home</a>
                                {isLoggedIn && <a href={`/patients?token=${props.token}`}>👥 Patients</a>}
                                {isLoggedIn && <a href={`/appointments?token=${props.token}`}>📅 Appointments</a>}
                            </div>
                        </div>

                        {/* Logout button */}
                        {isLoggedIn && (
                            <a href="/users/logout" className="logout-btn">🔓 Logout</a>
                        )}
                    </nav>
                )}

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
