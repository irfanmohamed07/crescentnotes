document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a');
    const sections = document.querySelectorAll('.content-section');
  
    // Function to handle section visibility
    function showSection(sectionId) {
      sections.forEach(section => {
        if (section.id === sectionId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    }
  
    // Initially show the users section
    showSection('users-section');
  
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
  
        // Determine which section to show based on the link clicked
        const sectionId = link.id.replace('-link', '-section');
        showSection(sectionId);
      });
    });
  });

// document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
//     event.preventDefault(); // Prevent normal form submission

//     const oldPassword = document.getElementById('oldPassword').value;
//     const newPassword = document.getElementById('newPassword').value;

//     // Validate data to make sure they are not empty
//     if (!oldPassword || !newPassword) {
//         alert("Both old and new passwords are required.");
//         return;
//     }

//     const data = {
//         oldPassword,
//         newPassword
//     };

//     try {
//         // Send the data as JSON to the server
//         const response = await fetch('/change-admin-password', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json', // Important for the server to parse the JSON
//             },
//             body: JSON.stringify(data) // Convert the data to JSON before sending it
//         });

//         const result = await response.json();

//         if (response.ok) {
//             alert(result.message);  // Show success message if response is OK
//         } else {
//             alert('Error: ' + result.message); // Show the server-side error message
//         }
//     } catch (err) {
//         console.error("Error:", err);
//         alert("An error occurred while trying to change the password.");
//     }
// });


//   async function deleteLoginAttempt(id) {
//     const confirmation = confirm('Are you sure you want to delete this login attempt?');
//     if (!confirmation) {
//         return;
//     }
//     try {
//         const response = await fetch(`/adminpanel/login-attempts/${id}`, {
//             method: 'DELETE'
//         });
//         const result = await response.json();
//         if (response.ok) {
//             alert(result.message);
//             window.location.reload(); // Reload the page to see the changes
//         } else {
//             alert(result.error);
//         }
//     } catch (error) {
//         console.error('Error deleting login attempt:', error);
//         alert('Error deleting login attempt');
//     }
// }



// async function deleteUser(id) {
//   const confirmation = confirm('Are you sure you want to delete this user?');
//   if (!confirmation) {
//       return;
//   }
//   try {
//       const response = await fetch(`/adminpanel/users/${id}`, {
//           method: 'DELETE'
//       });
//       const result = await response.json();
//       if (response.ok) {
//           alert(result.message);
//           window.location.reload(); // Reload the page to see the changes
//       } else {
//           alert(result.error);
//       }
//   } catch (error) {
//       console.error('Error deleting user:', error);
//       alert('Error deleting user');
//   }
// } 



// function deleteForm(formId) {
//     fetch(`/deleteForm/${formId}`, {
//       method: 'DELETE'
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         location.reload(); // Reload the page to reflect the changes
//       } else {
//         alert('Failed to delete form.');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       alert('An error occurred while deleting the form.');
//     });
//   }


//   function deleteAdminLogin(adminLoginId) {
//     fetch(`/deleteAdminLogin/${adminLoginId}`, {
//       method: 'DELETE'
//     })
//     .then(response => response.json())
//     .then(data => {
//       if (data.success) {
//         location.reload(); // Reload the page to reflect the changes
//       } else {
//         alert('Failed to delete admin login.');
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       alert('An error occurred while deleting the admin login.');
//     });
//   }
//   function editRow(id) {
//     document.getElementById('row-' + id).style.display = 'none';
//     document.getElementById('edit-row-' + id).style.display = 'table-row';
// }

// function saveRow(id) {
//     document.getElementById('row-' + id).style.display = 'table-row';
//     document.getElementById('edit-row-' + id).style.display = 'none';
// }

// function cancelEdit(id) {
//     document.getElementById('row-' + id).style.display = 'table-row';
//     document.getElementById('edit-row-' + id).style.display = 'none';
// }

// function togglePasswordVisibility(inputId, iconId) {
//   const input = document.getElementById(inputId);
//   const icon = document.getElementById(iconId);
//   if (input.type === 'password') {
//       input.type = 'text';
//       icon.classList.remove('fa-eye');
//       icon.classList.add('fa-eye-slash');
//   } else {
//       input.type = 'password';
//       icon.classList.remove('fa-eye-slash');
//       icon.classList.add('fa-eye');
//   }
// }

// document.getElementById('toggleOldPassword').addEventListener('click', () => {
//   togglePasswordVisibility('oldPassword', 'toggleOldPassword');
// });

// document.getElementById('toggleNewPassword').addEventListener('click', () => {
//   togglePasswordVisibility('newPassword', 'toggleNewPassword');
// });

// // Handle form submission
 

// // JavaScript to Handle Admin Registration
// document.getElementById('toggleAdminPassword').addEventListener('click', function () {
//   const passwordField = document.getElementById('adminPassword');
//   const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
//   passwordField.setAttribute('type', type);
//   this.classList.toggle('fa-eye-slash');
// });

// document.getElementById('registerAdminForm').addEventListener('submit', function (event) {
//   event.preventDefault(); // Prevent default form submission

//   // Get form values
//   const email = document.getElementById('adminEmail').value;
//   const password = document.getElementById('adminPassword').value;
//   const messageElement = document.getElementById('adminMessage');

//   // Send POST request to server
//   fetch('/register-admin', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ email, password })
//   })
//   .then(response => response.json()) // Parse JSON response
//   .then(data => {
//     // Display success or error message
//     messageElement.textContent = data.message;
//     messageElement.className = 'admin-message ' + (data.success ? 'success' : 'error');
//     messageElement.style.display = 'block';
//   })
//   .catch(error => {
//     console.error('Error:', error); // Log error to console
//     messageElement.textContent = 'An error occurred. Please try again later.';
//     messageElement.className = 'admin-message error';
//     messageElement.style.display = 'block';
//   });
// });

// async function deleteAdminUser(id) {
//   const confirmation = confirm('Are you sure you want to delete this admin user?');
//   if (!confirmation) {
//     return;
//   }

//   try {
//     const response = await fetch(`/adminpanel/admin-users/${id}`, {
//       method: 'DELETE',
//       credentials: 'include' // Include credentials in the request
//     });

//     const result = await response.json();

//     if (response.ok) {
//       alert(result.message);
//       window.location.reload(); // Reload the page to see the changes
//     } else {
//       alert(result.error);
//     }
//   } catch (error) {
//     console.error('Error deleting admin user:', error);
//     alert('Error deleting admin user');
//   }
// }
// document.addEventListener("DOMContentLoaded", function() {
//   const menu = document.querySelector(".three-dot-menu");
//   const menuItems = document.querySelectorAll(".menu-content a");
//   const sections = document.querySelectorAll(".content-section");

//   // Toggle menu visibility
//   menu.addEventListener("click", function() {
//     menu.classList.toggle("active");
//   });

//   // Close the menu if clicked outside
//   window.addEventListener("click", function(event) {
//     if (!menu.contains(event.target)) {
//       menu.classList.remove("active");
//     }
//   });

//   // Handle menu item clicks
//   menuItems.forEach(item => {
//     item.addEventListener("click", function(event) {
//       event.preventDefault();
//       const targetSectionId = item.getAttribute("data-section");
      
//       // Hide all sections
//       sections.forEach(section => {
//         section.classList.remove("active");
//       });

//       // Show the selected section
//       const targetSection = document.getElementById(targetSectionId);
//       if (targetSection) {
//         targetSection.classList.add("active");
//       }

//       // Close the menu after selection
//       menu.classList.remove("active");
//     });
//   });
// });


// document.getElementById('changePasswordForm').addEventListener('submit', async function(event) {
//   event.preventDefault(); // Prevent normal form submission

//   const oldPassword = document.getElementById('oldPassword').value;
//   const newPassword = document.getElementById('newPassword').value;

//   // Check if both passwords are present
//   if (!oldPassword || !newPassword) {
//       alert("Please enter both old and new passwords.");
//       return;  // Prevent sending empty data
//   }

//   const data = {
//       oldPassword,
//       newPassword
//   };

//   try {
//       const response = await fetch('/change-admin-password', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json' // Set content type to JSON
//           },
//           body: JSON.stringify(data) // Send the data in JSON format
//       });

//       const result = await response.json();
//       if (response.ok) {
//           alert(result.message);  // Handle success message
//       } else {
//           alert('Error: ' + result.message);  // Show error message from server
//       }
//   } catch (err) {
//       console.error("Error:", err);
//       alert("An error occurred. Please try again.");
//   }
// });
