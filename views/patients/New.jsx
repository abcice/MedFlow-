const React = require('react');
const Layout = require('../layouts/Layout');

function New(props) {
    return (
        <Layout>
            <h1>🏥 Add New Patient</h1>

            {}
            <form action={`/patients?token=${props.token}`} method="POST" encType="multipart/form-data">
                
                <div className="form-group">
                    <label htmlFor="name">Full Name:</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name" 
                        placeholder="Enter patient's full name..."
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="cpr">CPR:</label>
                    <input 
                        type="text" 
                        id="cpr"
                        name="cpr" 
                        placeholder="Enter CPR number..."
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input 
                        type="number" 
                        id="age"
                        name="age" 
                        placeholder="Enter patient's age..."
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="gender">Gender:</label>
                    <select id="gender" name="gender" required>
                        <option value="">-- Select Gender --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input 
                        type="text" 
                        id="phone"
                        name="phone" 
                        placeholder="Enter phone number..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input 
                        type="text" 
                        id="address"
                        name="address" 
                        placeholder="Enter address..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="paymentType">Payment Type:</label>
                    <select id="paymentType" name="paymentType" required>
                        <option value="">-- Select Payment Type --</option>
                        <option value="Cash">Cash</option>
                        <option value="Insurance">Insurance</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="insuranceProvider">Insurance Provider (if applicable):</label>
                    <input 
                        type="text" 
                        id="insuranceProvider"
                        name="insuranceProvider" 
                        placeholder="Enter insurance provider name..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="photo">Patient Photo:</label>
                    <input 
                        type="file" 
                        id="photo"
                        name="photo" 
                        accept="image/*"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="notes">Notes:</label>
                    <textarea 
                        id="notes" 
                        name="notes" 
                        placeholder="Enter any notes..."
                    ></textarea>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        ➕ Create Patient
                    </button>
                    <a href={`/patients?token=${props.token}`} className="btn btn-secondary">
                        ← Back to All Patients
                    </a>
                </div>
            </form>
        </Layout>
    );
}

module.exports = New;
