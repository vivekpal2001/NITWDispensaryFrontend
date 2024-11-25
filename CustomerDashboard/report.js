let reports = [
    { type: "Blood Test", date: "2024-09-05", doctor: "Dr. Smith" },
    { type: "X-Ray", date: "2024-08-28", doctor: "Dr. Johnson" },
    { type: "MRI", date: "2024-08-15", doctor: "Dr. Williams" },
    { type: "CT Scan", date: "2024-09-10", doctor: "Dr. Brown" },
    { type: "Blood Test", date: "2024-09-01", doctor: "Dr. Davis" },
    { type: "X-Ray", date: "2024-08-20", doctor: "Dr. Miller" },
];

const reportsContainer = document.querySelector('.card-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

function formatDate(dateStr) {
    const date = new Date(dateStr); // Parse the date string
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function renderReports(reportsToRender) {
    reportsContainer.innerHTML = '';
    reportsToRender.forEach(report => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <div class="card-icon"><i class='bx bx-file'></i></div>
            <h3>${report.type || "Report"}</h3>
            <p>Date: ${formatDate(report.date)}</p>
            <p>Doctor: ${report.doctor}</p>
            <button class="view-report main-bill">Bill</button>
            <button class="view-report main-report">View Report</button>
            <button class="view-report main-prescription">Prescription</button>
        `;

        // Event listener for viewing the report
        const viewReportBtn = card.querySelector('.main-report');
        viewReportBtn.addEventListener('click', () => {
            if (report.report) {
                window.open(report.report, '_blank'); // Open the report in a new tab
            } else {
                alert('Report not available');
            }
        });

        // Event listener for viewing the bill
        const viewBillBtn = card.querySelector('.main-bill');
        viewBillBtn.addEventListener('click', () => {
            if (report.bill) {
                window.open(report.bill, '_blank'); // Open the bill in a new tab
            } else {
                alert('Bill not available');
            }
        });

        // Event listener for viewing the prescription
        const viewPrescriptionBtn = card.querySelector('.main-prescription');
        viewPrescriptionBtn.addEventListener('click', () => {
            if (report.prescription) {
                window.open(report.prescription, '_blank'); // Open the prescription in a new tab
            } else {
                alert('Prescription not available');
            }
        });

        reportsContainer.appendChild(card);
    });
}


function searchReports(reportsToSearch, searchTerm) {
    return reportsToSearch.filter(report => 
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(report.date).includes(searchTerm) ||
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

function sortReportsByDate(reportsToSort) {
    return reportsToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function fetchAppointments() {
    try {
        const email = localStorage.getItem('email'); // Retrieve the email from local storage
        if (!email) {
            throw new Error('Email not found in local storage');
        }
        console.log('Fetching appointments for email:', email);

        const response = await axios.get('https://nitw-dispensary-backend.vercel.app/patient/getallappointments', {
            params: { email } // Correctly use email variable
        });

        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.status === 200) {
            const appointments = response.data;
            console.log('Fetched appointments:', appointments);
            const sortedAppointments = sortReportsByDate(appointments); // Sort fetched appointments
            renderReports(sortedAppointments); // Render appointments as reports
        } else {
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching appointments from the backend:', error.response ? error.response.data : error.message);
        alert('Could not load appointments. Please try again later.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        const searchedReports = searchReports(reports, searchTerm);
        const sortedReports = sortReportsByDate(searchedReports);
        renderReports(sortedReports);
    });

    // Fetch and render appointments when the page loads
    fetchAppointments();
});