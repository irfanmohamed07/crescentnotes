document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("resetPasswordForm");
    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const toggleNewPassword = document.getElementById("toggleNewPassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
    
    // Toggle visibility of new password
    toggleNewPassword.addEventListener("click", () => {
        const type = newPassword.type === "password" ? "text" : "password";
        newPassword.type = type;
        toggleNewPassword.classList.toggle("fa-eye-slash");
    });

    // Toggle visibility of confirm password
    toggleConfirmPassword.addEventListener("click", () => {
        const type = confirmPassword.type === "password" ? "text" : "password";
        confirmPassword.type = type;
        toggleConfirmPassword.classList.toggle("fa-eye-slash");
    });

    // Validate password on form submission
    form.addEventListener("submit", (e) => {
        const passwordValue = newPassword.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();

        // Check minimum length
        if (passwordValue.length < 6) {
            alert("Password must be at least 6 characters long.");
            e.preventDefault();
            return;
        }

        // Check if passwords match
        if (passwordValue !== confirmPasswordValue) {
            alert("Passwords do not match.");
            e.preventDefault();
            return;
        }
    });
});
