document.addEventListener('DOMContentLoaded', function() {
    const appointmentsContainer = document.getElementById('appointments-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const bookAppointmentBtn = document.querySelector('.book-appointment-btn');
    const calendarEl = document.getElementById('calendar');

    let appointments = [];
    let calendar;

    // Create modal elements
    const doctorModal = createModal('doctorModal');
    const appointmentModal = createModal('appointmentModal');
    const successMessage = createSuccessMessage();

    async function fetchAppointments() {
        try {
            const email = localStorage.getItem('email');
            if (!email) {
                throw new Error('Email not found in local storage');
            }
            console.log('Fetching appointments for email:', email);
    
            const response = await axios.get('https://nitw-dispensary-backend.vercel.app/patient/getallappointments', {
                params: { email }
            });
    
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
    
            if (response.status === 200) {
                appointments = response.data;
                console.log('Fetched appointments:', appointments);
                renderAppointments(appointments);
                updateCalendar(appointments);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching appointments from the backend:', error.response ? error.response.data : error.message);
            alert('Could not load appointments. Please try again later.');
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    function renderAppointments(appointmentsToRender) {
        appointmentsContainer.innerHTML = '';
        appointmentsToRender.forEach(appointment => {
            const card = document.createElement('div');
            card.className = 'appointment-card';
            card.innerHTML = `
                <h3>${appointment.doctor} - ${appointment.specialty}</h3>
                <p><i class="far fa-calendar-alt"></i> Date: ${formatDate(appointment.date)}</p>
                <p><i class="far fa-clock"></i> Time: ${appointment.time}</p>
            `;
            appointmentsContainer.appendChild(card);
        });
    }

    function filterAppointments(appointments, searchTerm) {
        return appointments.filter(appointment => 
            appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatDate(appointment.date).includes(searchTerm) ||
            appointment.time.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        const filteredAppointments = filterAppointments(appointments, searchTerm);
        renderAppointments(filteredAppointments);
        updateCalendar(filteredAppointments);
    });

    bookAppointmentBtn.addEventListener('click', () => {
        renderDoctorList();
        doctorModal.style.display = "block";
    });

    function initializeCalendar() {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: 'today'
            },
            events: appointments.map(appointment => createCalendarEvent(appointment)),
            eventClick: function(info) {
                alert(`Appointment details:\nDoctor: ${info.event.extendedProps.doctor}\nSpecialty: ${info.event.extendedProps.specialty}\nDate: ${info.event.start.toLocaleDateString()}\nTime: ${info.event.extendedProps.time}`);
            },
            eventContent: function(arg) {
                return {
                    html: `<div class="fc-content">
                        <span class="fc-title">${arg.event.title}</span>
                        <span class="fc-time">${arg.event.extendedProps.time}</span>
                    </div>`
                };
            }
        });

        calendar.render();
    }

    function createCalendarEvent(appointment) {
        return {
            id: appointment._id,
            title: `${appointment.doctor} - ${appointment.specialty}`,
            start: `${formatDate(appointment.date)}T${convertTo24Hour(appointment.time)}`,
            allDay: false,
            extendedProps: {
                doctor: appointment.doctor,
                specialty: appointment.specialty,
                time: appointment.time
            }
        };
    }

    function updateCalendar(filteredAppointments) {
        calendar.removeAllEvents();
        filteredAppointments.forEach(appointment => {
            calendar.addEvent(createCalendarEvent(appointment));
        });
    }

    function convertTo24Hour(time12h) {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}:00`;
    }

    function createModal(id) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'modal';
        document.body.appendChild(modal);
        return modal;
    }

    function createSuccessMessage() {
        const message = document.createElement('div');
        message.id = 'successMessage';
        message.style.display = 'none';
        document.body.appendChild(message);
        return message;
    }

    function renderDoctorList() {
        const doctors = [
            { id: 1, name: "Dr. Sudhakar Reddy", specialization: "Cardiologist", image: "smith.jpg" },
            { id: 2, name: "Dr. Hemanth Reddy", specialization: "Ophthalmologist", image: "johnson.jpg" },
            { id: 3, name: "Dr. B. Jagadeesh Babu", specialization: "Psychiatrist", image: "williams.jpg" },
            { id: 4, name: "Dr. B. Sandhya Rani", specialization: "Gynecologist", image: "brown.jpg" },
            { id: 5, name: "Dr. J. Sowmya", specialization: "Pulmonologist", image: "brown.jpg" },
            { id: 6, name: "Dr. G. Vidya Reddy", specialization: "Dermatologist", image: "brown.jpg" },
            { id: 7, name: "Dr. P. Prathik", specialization: "Dental", image: "brown.jpg" },
            { id: 8, name: "Dr. P. Sumanth", specialization: "Pediatrician", image: "brown.jpg" },
        ];

        doctorModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Select a Doctor</h2>
                <div id="doctorList" class="doctor-grid">
                    ${doctors.map(doctor => `
                        <div class="doctor-card" data-id="${doctor.id}">
                            <i style="font-size:3rem;" class='bx bxs-user'></i>
                            <h3>${doctor.name}</h3>
                            <p>${doctor.specialization}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.doctor-card').forEach(card => {
            card.onclick = function() {
                doctorModal.style.display = "none";
                renderAppointmentForm(this.dataset.id);
            }
        });

        document.querySelector('.close').onclick = function() {
            doctorModal.style.display = "none";
        }
    }

    function renderAppointmentForm(doctorId) {
        const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
        const generateAvailableDates = (days) => {
            const availableDates = [];
            const today = new Date();
        
            for (let i = 0; i < days; i++) {
                const currentDate = new Date();
                currentDate.setDate(today.getDate() + i); // Add 'i' days to today
                
                // Format date to 'YYYY-MM-DD'
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(currentDate.getDate()).padStart(2, '0');
                
                const formattedDate = `${year}-${month}-${day}`;
                availableDates.push(formattedDate);
            }
        
            return availableDates;
        };
        
        // Generate available dates for the next 7 days
        const availableDates = generateAvailableDates(7);
        console.log(availableDates);
        

        appointmentModal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Book Appointment</h2>
                <form id="appointmentForm" class="appointment-form">
                    <div class="form-group">
                        <label for="name">Name:</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="sex">Sex:</label>
                        <select id="sex" name="sex" required>
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="age">Age:</label>
                        <input type="number" id="age" name="age" required>
                    </div>
                    <div class="form-group">
                        <label for="timeSlot">Time Slot:</label>
                        <select id="timeSlot" name="timeSlot" required>
                            ${timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="date">Date:</label>
                        <select id="date" name="date" required>
                            ${availableDates.map(date => `<option value="${date}">${date}</option>`).join('')}
                        </select>
                    </div>
                    <p class="charges">Fixed Charges: Rs.200</p>
                    <button type="submit" class="submit-btn">Book Appointment</button>
                </form>
            </div>
        `;

        appointmentModal.style.display = "block";

        document.getElementById('appointmentForm').onsubmit = async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const appointmentDetails = Object.fromEntries(formData);
            appointmentModal.style.display = "none";
            await addNewAppointment(doctorId, appointmentDetails);
            showSuccessMessage(appointmentDetails.date, appointmentDetails.timeSlot);
        }

        document.querySelector('.close').onclick = function() {
            appointmentModal.style.display = "none";
        }
    }

    async function addNewAppointment(doctorId, details) {
        try {
            const doctor = [
                { id: 1, name: "Dr. Sudhakar Reddy", specialization: "Cardiologist", image: "smith.jpg" },
            { id: 2, name: "Dr. Hemanth Reddy", specialization: "Ophthalmologist", image: "johnson.jpg" },
            { id: 3, name: "Dr. B. Jagadeesh Babu", specialization: "Psychiatrist", image: "williams.jpg" },
            { id: 4, name: "Dr. B. Sandhya Rani", specialization: "Gynecologist", image: "brown.jpg" },
            { id: 5, name: "Dr. J. Sowmya", specialization: "Pulmonologist", image: "brown.jpg" },
            { id: 6, name: "Dr. G. Vidya Reddy", specialization: "Dermatologist", image: "brown.jpg" },
            { id: 7, name: "Dr. P. Prathik", specialization: "Dental", image: "brown.jpg" },
            { id: 8, name: "Dr. P. Sumanth", specialization: "Pediatrician", image: "brown.jpg" },
            ].find(d => d.id == doctorId);

            const newAppointment = {
                email: localStorage.email,
                doctor: doctor.name,
                specialty: doctor.specialty,
                date: details.date,
                time: details.timeSlot,
                patientName: details.name,
                patientAge: details.age,
                patientSex: details.sex,
            };

            const response = await axios.post('https://nitw-dispensary-backend.vercel.app/patient/appointments', newAppointment);
            if (response.status === 201) {
                // Add the new appointment to the appointments array
                appointments.push(newAppointment);

                // Create a new calendar event and add it to the calendar
                const newEvent = createCalendarEvent(newAppointment);
                calendar.addEvent(newEvent);

                // Update the appointments list in the UI
                renderAppointments(appointments);

                console.log('New appointment added successfully:', newAppointment);
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding new appointment:', error);
            alert('Could not book appointment. Please try again later.');
        }
    }

    function showSuccessMessage(date, time) {
        successMessage.textContent = `Successfully booked appointment on ${date} at ${time}`;
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }

    initializeCalendar();
    fetchAppointments();

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === doctorModal) {
            doctorModal.style.display = "none";
        }
        if (event.target === appointmentModal) {
            appointmentModal.style.display = "none";
        }
    }
});