
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const signUpForm = document.querySelector('.sign-up form');
const signInForm = document.querySelector('.sign-in form');

// Add event listeners for toggling between sign-up and sign-in forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});



const API_URL = "https://nitw-dispensary-backend.vercel.app";

// Function to handle form submissions
async function handleFormSubmit(event, type) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        if (type === 'signin') {
            let url = `${API_URL}/doctor/signin`;
            const response = await axios.post(url, data);
            console.log(response);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('username', response.data.name);
            localStorage.setItem('id', response.data.id);
            alert("Signup Successful!");

            window.location.href = '../DoctorProfile/appointment.html';  // Redirect to signin page after signup
        } else if (type === 'signup') {
            //let url = `${API_URL}/patient/signin`;
            const response = await axios.post(url, data);
            // Handle success response for signin
            const { email, name, id } = response.data;

            // Store email, username, and id in local storage
            localStorage.setItem('email', email);
            localStorage.setItem('username', name);
            localStorage.setItem('id', id);

            //window.location.href = '/DoctorProfile/index.html'; // Redirect to main index page after signin
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle error response
        alert(`Error: ${error.response.data.message}`);
    }
}

// Add event listeners for form submissions
signUpForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signup'));
signInForm.addEventListener('submit', (event) => handleFormSubmit(event, 'signin'));


const adminbtn=document.getElementsByClassName("admin-sign-in");
