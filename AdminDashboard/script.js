

document.addEventListener('DOMContentLoaded', function() {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

    allSideMenu.forEach(item => {
        const li = item.parentElement;

        item.addEventListener('click', function() {
            allSideMenu.forEach(i => {
                i.parentElement.classList.remove('active');
            });
            li.classList.add('active');
        });
    });

    // Toggle Sidebar
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    menuBar.addEventListener('click', function() {
        sidebar.classList.toggle('hide');
    });

    const searchButton = document.querySelector('#content nav form .form-input button');
    const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
    const searchForm = document.querySelector('#content nav form');

    searchButton.addEventListener('click', function(e) {
        if (window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            if (searchForm.classList.contains('show')) {
                searchButtonIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    });

    if (window.innerWidth < 768) {
        sidebar.classList.add('hide');
    } else if (window.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }

    window.addEventListener('resize', function() {
        if (this.innerWidth > 576) {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });

    const switchMode = document.getElementById('switch-mode');

    switchMode.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    // Initialize Chart
    var ctx = document.getElementById('patientChart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'New Patients',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#3498db',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'New Patients per Month'
                }
            }
        }
    });
// 
   
});

// Fetch appointments and render them on window load
window.onload = function() {
    fetchAppointments();
};

async function fetchAppointments() {
    try {
        const response = await axios.get('https://nitw-dispensary-backend.vercel.app/admin/getAll');

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        // Filter appointments to only show those that are 'waiting' and upcoming
        const now = new Date();
        const upcomingAppointments = response.data.filter(appointment => 
            appointment.status === 'waiting' && new Date(appointment.date) > now
        );

        console.log('Upcoming waiting appointments:', upcomingAppointments);
        renderAppointments(upcomingAppointments); // Render filtered appointments

    } catch (error) {
        console.error('Error fetching appointments from the backend:', error.response ? error.response.data : error.message);
    }
}

// function renderAppointments(appointments) {
//     const appointmentsList = document.getElementById('appointmentsList');
//     appointmentsList.innerHTML = appointments.map(app => `
//         <div class="appointment-item">
//             <div class="appointment-avatar">${app.patientName.charAt(0)}</div>
//             <div class="appointment-details">

  

//                 <strong>${app.patientName}</strong> - ${app.time}
//                 <br>
//                 <small>${app.doctor} (${app.specialty})</small>
//                 <br>
//                 <small>${new Date(app.date).toLocaleDateString()}</small>
//             </div>
//             <div class="appointment-actions">
//                 <button class="btn btn-confirm" onclick="confirmAppointment(${app._id})">Confirm</button>
//                 <button class="btn btn-reschedule" onclick="rescheduleAppointment(${app._id})">Reschedule</button>
//                 <button class="btn btn-cancel" onclick="cancelAppointment(${app._id})">Cancel</button>
//             </div>
//         </div>
//     `).join('');
// }
function renderAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = appointments.map(app => `
        <div class="appointment-item">
            <div class="appointment-avatar">${app.patientName.charAt(0)}</div>
            <div class="appointment-details">
                <strong>${app.patientName}</strong> - ${app.time}
                <br>
                <small>${app.doctor} (${app.specialty})</small>
                <br>
                <small>${new Date(app.date).toLocaleDateString()}</small>
            </div>
            <div class="appointment-actions">
                <button class="btn btn-confirm" onclick="confirmAppointment('${app._id}')">Confirm</button>
                <button class="btn btn-reschedule" onclick="rescheduleAppointment('${app._id}')">Reschedule</button>
                <button class="btn btn-cancel" onclick="cancelAppointment('${app._id}')">Cancel</button>
            </div>
        </div>
    `).join('');
}
