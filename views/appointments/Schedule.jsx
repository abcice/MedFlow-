const React = require('react');

function Schedule({ appointments, doctors }) {
  return (
    <html>
      <head>
        <title>Schedule View</title>
        <link rel="stylesheet" href="/public/styles.css" />
        <link rel="stylesheet" href="https://uicdn.toast.com/calendar/latest/toastui-calendar.min.css" />
      </head>
      <body>
        <div id="calendar" style={{ height: '800px', margin: '20px' }}></div>

        <script src="https://uicdn.toast.com/calendar/latest/toastui-calendar.min.js"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            const Calendar = tui.Calendar;

            const calendar = new Calendar('#calendar', {
              defaultView: 'timeGrid',
              useFormPopup: true,
              useDetailPopup: true,
              week: {
                showNowIndicator: true,
                showTimezoneCollapseButton: true,
              },
              calendars: ${JSON.stringify(doctors.map(doc => ({
                id: doc._id,
                name: doc.name,
                backgroundColor: '#03bd9e',
              })))}
            });

            const appointments = ${JSON.stringify(appointments.map(app => ({
              id: app._id,
              calendarId: app.doctor._id,
              title: app.patient.name + ' - ' + (app.reason || 'Appointment'),
              category: 'time',
              start: new Date(app.date).toISOString(),
              end: new Date(new Date(app.date).getTime() + (app.estimatedDuration || 30) * 60000).toISOString()
            })))};

            appointments.forEach(event => calendar.createSchedules([event]));
          `
        }} />
      </body>
    </html>
  );
}

module.exports = Schedule;
