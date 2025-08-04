const React = require('react');
const Layout = require('../layouts/Layout');

function New(props) {
    const token = props.token;

    return (
        <Layout token={token}>
            <h1>📅 Create New Appointment</h1>

            <form action={`/appointments?token=${token}`} method="POST">
                {/* Patient CPR Search */}
                <div>
                    <label>Patient CPR:</label>
<input type="text" name="patientCPR" placeholder="Enter CPR..." required />

                    <ul id="cprSuggestions"></ul>
                </div>

                {/* Doctor Dropdown */}
                <div>
                    <label>Doctor:</label>
                    <select id="doctorSelect" name="doctor" required>
                        <option value="">-- Select Doctor --</option>
                    </select>
                </div>

                <div>
                    <label>Date:</label>
                    <input type="date" name="date" required />
                </div>

                <div>
                    <label>Time:</label>
                    <input type="time" name="time" required />
                </div>

                <div>
                    <label>Reason:</label>
                    <textarea name="reason"></textarea>
                </div>

                <button type="submit">Save Appointment</button>
                <a href={`/dashboard?token=${token}`} className="btn btn-secondary">Cancel</a>
            </form>

            {/* Inline Script for Fetching Data */}
            <script dangerouslySetInnerHTML={{
                __html: `
                    async function searchCPR() {
                        const input = document.getElementById('patientCPR').value;
                        const suggestionsList = document.getElementById('cprSuggestions');
                        suggestionsList.innerHTML = '';
                        if (input.length < 2) return;
                        const res = await fetch('/patients/search/cpr?cpr=' + input + '&token=${token}');
                        const data = await res.json();
                        data.forEach(patient => {
                            const li = document.createElement('li');
                            li.textContent = patient.cpr + ' - ' + patient.name;
                            li.onclick = () => {
                                document.getElementById('patientCPR').value = patient.cpr;
                                suggestionsList.innerHTML = '';
                            };
                            suggestionsList.appendChild(li);
                        });
                    }

                    async function loadDoctors() {
                        const res = await fetch('/users/doctors?token=${token}');
                        const doctors = await res.json();
                        const select = document.getElementById('doctorSelect');
                        doctors.forEach(doc => {
                            const option = document.createElement('option');
                            option.value = doc._id;
                            option.textContent = doc.name;
                            select.appendChild(option);
                        });
                    }

                    loadDoctors();
                `
            }} />
        </Layout>
    );
}

module.exports = New;
