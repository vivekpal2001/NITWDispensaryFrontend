document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Check if the email and password are "admin"
    if (email === "admin@gmail.com" && password === "admin") {
        // Redirect to the admin page
        window.location.href = "../AdminDashboard/index.html"; // Replace with the actual admin page URL
    } else {
        // Display an error message or alert
        alert("Invalid email or password. Please try again.");
    }
});
