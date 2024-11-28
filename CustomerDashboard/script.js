document.addEventListener('DOMContentLoaded', function() {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');
    const bookAppointmentBtn = document.getElementById('book-appointment-btn');
    const appointmentCardContainer = document.getElementById('appointment-card-container');

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

    let appointments = [];

    // Create modal elements
    const doctorModal = createModal('doctorModal');
    const appointmentModal = createModal('appointmentModal');
    const successMessage = createSuccessMessage();

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
    menuBar.addEventListener('click', () => sidebar.classList.toggle('hide'));

    // Book Appointment Button
    if (bookAppointmentBtn) {
        bookAppointmentBtn.addEventListener('click', () => {
            renderDoctorList();
            doctorModal.style.display = "block";
        });
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
            let doctor = doctors.find(d => d.id == doctorId);

            const newAppointment = {
                email: localStorage.email,
                doctor: doctor.name,
                specialty: doctor.specialization,
                date: details.date,
                time: details.timeSlot,
                patientName: details.name,
                patientAge: details.age,
                patientSex: details.sex,
            };

            const response = await axios.post('https://nitw-dispensary-backend.vercel.app/patient/appointments', newAppointment);
            if (response.status === 201) {
                appointments.push(newAppointment);
                // renderAppointments();
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



});



window.onload = function() {
    // Retrieve email from localStorage
    const email = localStorage.getItem('email');

    if (email) {
        // Fetch upcoming appointments
        axios.get('https://nitw-dispensary-backend.vercel.app/patient/getallappointments', {
            params: { email } // Send email as a query parameter
        })
        .then(response => {
            const appointments = response.data; // Assuming the response contains an array of appointment objects
            const appointmentContainer = document.getElementById('appointment-card-container');
            const reportContainer = document.getElementById('report-card-container');

            // Clear the containers before rendering
            appointmentContainer.innerHTML = '';
            reportContainer.innerHTML = '';

            // Get today's date to filter upcoming appointments
            const today = new Date();

            // Filter upcoming appointments
            const upcomingAppointments = appointments.filter(appointment => {
                const appointmentDate = new Date(appointment.date);
                return appointmentDate >= today;
            });

            // Loop through each upcoming appointment and dynamically create cards
            upcomingAppointments.forEach(appointment => {
                const appointmentCard = document.createElement('div');
                appointmentCard.classList.add('card');

                const cardIcon = document.createElement('div');
                cardIcon.classList.add('card-icon');
                cardIcon.innerHTML = "<i class='bx bx-calendar'></i>";

                const appointmentTitle = document.createElement('h3');
                appointmentTitle.innerText = `${appointment.doctor} - ${appointment.specialty}`;

                const appointmentDate = document.createElement('p');
                appointmentDate.innerText = `Date: ${new Date(appointment.date).toLocaleDateString()}`;

                const appointmentTime = document.createElement('p');
                appointmentTime.innerText = `Time: ${appointment.time}`;

                // Append elements to the card
                appointmentCard.appendChild(cardIcon);
                appointmentCard.appendChild(appointmentTitle);
                appointmentCard.appendChild(appointmentDate);
                appointmentCard.appendChild(appointmentTime);

                // Append the card to the container
                appointmentContainer.appendChild(appointmentCard);
            });

            // Render reports
            appointments.forEach(report => {
                const reportCard = document.createElement('div');
                reportCard.classList.add('card');

                const cardIcon = document.createElement('div');
                cardIcon.classList.add('card-icon');
                cardIcon.innerHTML = "<i class='bx bx-file'></i>";

                const reportTitle = document.createElement('h3');
                reportTitle.innerText = "Report"; // Replace 'title' with actual key

                const reportDate = document.createElement('p');
                reportDate.innerText = `Date: ${new Date(report.date).toLocaleDateString()}`; // Assuming 'date' is a valid field

                const viewButton = document.createElement('button');
                viewButton.classList.add('view-report');
                viewButton.innerText = 'View Report';

                // Check if report.report is null
                if (report.report) {
                    viewButton.onclick = function() {
                        window.open(report.report, '_blank'); // Assuming 'report' contains the report URL
                    };
                } else {
                    viewButton.onclick = function() {
                        alert('No report available for this appointment.');
                    };
                }

                // Append elements to the card
                reportCard.appendChild(cardIcon);
                reportCard.appendChild(reportTitle);
                reportCard.appendChild(reportDate);
                reportCard.appendChild(viewButton);

                // Append the card to the container
                reportContainer.appendChild(reportCard);
            });
        })
        .catch(error => {
            console.error('Error fetching appointments/reports:', error);
        });
    } else {
        console.error('No email found in localStorage');
    }
};
