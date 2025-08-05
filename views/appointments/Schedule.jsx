const React = require('react');
const Layout = require('../layouts/Layout');
const { Calendar, Views, dateFnsLocalizer } = require('react-big-calendar');
const { format, parse, startOfWeek, getDay } = require('date-fns');

require('react-big-calendar/lib/css/react-big-calendar.css');

const locales = {
    'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales
});

function Schedule(props) {
    const { token, doctors, appointments, selectedDate, selectedDoctor } = props;

    // Map doctors to "resources" (columns)
    const resources = doctors.map(doc => ({
        resourceId: doc._id,
        resourceTitle: `Dr. ${doc.name}`
    }));

    // Convert appointments to `react-big-calendar` events
    const events = appointments
        .filter(appt => !selectedDoctor || appt.doctor._id === selectedDoctor)
        .map(appt => ({
            id: appt._id,
            title: appt.patient.name,
            start: new Date(appt.startDateTime),
            end: new Date(new Date(appt.startDateTime).getTime() + (appt.estimatedDuration || 30) * 60000),
            resourceId: appt.doctor._id,
            status: appt.status,
            tooltip: `Patient: ${appt.patient.name} (${appt.patient.cpr})\nReason: ${appt.reason}\nDuration: ${appt.estimatedDuration || 'N/A'} mins`
        }));

    return (
        <Layout token={token}>
            <h1>📅 Appointment Schedule</h1>

            {/* Filters */}
            <form method="GET" action="/appointments/schedule" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input type="hidden" name="token" value={token} />
                <label>
                    Date:
                    <input type="date" name="date" defaultValue={selectedDate} />
                </label>
                <label>
                    Doctor:
                    <select name="doctor" defaultValue={selectedDoctor}>
                        <option value="">All Doctors</option>
                        {doctors.map(doc => (
                            <option key={doc._id} value={doc._id}>Dr. {doc.name}</option>
                        ))}
                    </select>
                </label>
                <button type="submit" className="btn btn-primary">Apply</button>
            </form>

            {/* Calendar */}
            <Calendar
                localizer={localizer}
                events={events}
                defaultView={Views.DAY}
                views={[Views.DAY]}
                step={30} // slot size in minutes
                timeslots={1}
                defaultDate={selectedDate ? new Date(selectedDate) : new Date()}
                style={{ height: '80vh' }}
                resources={resources}
                resourceIdAccessor="resourceId"
                resourceTitleAccessor="resourceTitle"
                eventPropGetter={(event) => {
                    let bgColor = '#0077b6';
                    if (event.status === 'Completed') bgColor = '#6c757d';
                    if (event.status === 'Cancelled') bgColor = '#d62828';
                    return { style: { backgroundColor: bgColor, color: 'white', borderRadius: '6px' } };
                }}
                tooltipAccessor="tooltip"
            />
        </Layout>
    );
}

module.exports = Schedule;
