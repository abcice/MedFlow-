const React = require('react');
const Layout = require('../layouts/Layout');

function Favorites({ favorites, token, recordId }) {
    return (
        <Layout token={token}>
            <h1>⭐ Favorite Prescriptions</h1>

            <h3>Your Favorites</h3>
            <ul>
                {favorites.map(fav => (
                    <li key={fav._id}>
                        <form
                            method="POST"
                            action={`/patientRecords/${recordId}/useFavorite/${fav._id}?token=${token}`}
                            style={{ display: 'inline' }}
                        >
                            <button type="submit" className="btn btn-light">
                                {fav.name}
                            </button>
                        </form>
                    </li>
                ))}
            </ul>

            <h3>Add New Favorite</h3>
            <form method="POST" action={`/patientRecords/${recordId}/favorites?token=${token}`}>
                <input type="text" name="name" placeholder="Favorite Name" required />
                <input type="text" name="drugName" placeholder="Drug Name" required />
                <input type="text" name="dose" placeholder="Dose" />
                <input type="text" name="route" placeholder="Route" />
                <input type="text" name="frequency" placeholder="Frequency" />
                <input type="text" name="duration" placeholder="Duration" />
                <textarea name="notes" placeholder="Notes"></textarea>
                <button type="submit" className="btn btn-primary">💾 Save Favorite</button>
            </form>
        </Layout>
    );
}

module.exports = Favorites;
