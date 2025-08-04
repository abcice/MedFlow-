const React = require('react');
const Layout = require('../layouts/Layout');

function Edit(props) {
    const { appointment, token, doctors } = props;

    return (
        <Layout token={token}>
            <div className="edit-appointment-container">
                <h1>✏️ Edit Appointment</h1>

                <form action={`/appointments/${appointment._id}?_method=PUT&token=${token}`} method="POST">
                    
                    {/* Patient Name & CPR - Readonly */}
                    <div>
                        <label>Patient:</label>
                        <input 
                            type="text" 
                            value={`${appointment.patient?.name} (${appointment.patient?.cpr})`} 
                            readOnly
                        />
                    </div>

                    {/* Doctor Select */}
                    <div>
                        <label>Doctor:</label>
                        <select name="doctor" defaultValue={appointment.doctor?._id} required>
                            <option value="">-- Select Doctor --</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label>Date:</label>
                        <input 
                            type="date" 
                            name="date" 
                            defaultValue={appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : ''} 
                            required 
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label>Time:</label>
                        <input 
                            type="time" 
                            name="time" 
                            defaultValue={appointment.time || ''} 
                            required 
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label>Reason:</label>
                        <textarea name="reason" defaultValue={appointment.reason}></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="form-buttons">
                        <button type="submit" className="btn btn-primary">💾 Save Changes</button>
                        <a href={`/appointments?token=${token}`} className="btn btn-secondary">← Cancel</a>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

module.exports = Edit;
