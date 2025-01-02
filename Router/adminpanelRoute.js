import express from "express";
import {upload} from '../config/aws.js';
import pool from "../Db/index.js";  
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const router = express.Router();


 

router.get('/adminpanel', async (req, res) => {
    if (req.session.isAdminAuthenticated) {
      // Query to fetch users
      pool.query('SELECT * FROM users', (userError, userResult) => {
        if (userError) {
          console.error("Error fetching users: ", userError);
          res.status(500).send("Internal Server Error");
          return;
        }
  
        // Query to fetch login attempts
        pool.query('SELECT * FROM logins', (loginError, loginResult) => {
          if (loginError) {
            console.error("Error fetching login attempts: ", loginError);
            res.status(500).send("Internal Server Error");
            return;
          }
  
          // Query to fetch forms
          pool.query('SELECT * FROM forms', (formError, formResult) => {
            if (formError) {
              console.error("Error fetching forms: ", formError);
              res.status(500).send("Internal Server Error");
              return;
            }
  
            // Query to fetch admin logins
            pool.query('SELECT * FROM adminlogins', (adminloginError, adminloginsResult) => {
              if (adminloginError) {
                console.error("Error fetching admin logins: ", adminloginError);
                res.status(500).send("Internal Server Error");
                return;
              }
  
              // Query to fetch notes
              pool.query('SELECT * FROM notes', (notesError, notesResult) => {
                if (notesError) {
                  console.error("Error fetching notes: ", notesError);
                  res.status(500).send("Internal Server Error");
                  return;
                }
                pool.query('SELECT * FROM userss', (userssError, userssResult) => {
                  if (userssError) {
                    console.error("Error fetching notes: ", userssError);
                    res.status(500).send("Internal Server Error");
                    return;
                  }
                // Render admin panel with users, login attempts, forms, admin logins, and notes
                res.render('adminpanel', { 
                  users: userResult.rows,
                  logins: loginResult.rows,
                  forms: formResult.rows,
                  adminlogins: adminloginsResult.rows,
                  notes: notesResult.rows, // Add notes data
                  admins: userssResult.rows
                });
              });
            });
          });
        });
      });
    });
    } else {
      res.redirect('/admin');
    }
  });


// POST Route to upload or update notes
router.post("/adminpanel", upload.single("pdf"), async (req, res) => {
  const { id, branch, department, semester, serial_number, course_code, subject_name, module_1 } = req.body;
  
  // Get S3 file URL if a new file was uploaded or use the existing one
  const pdf = req.file ? req.file.location : req.body.current_pdf;
  
  try {
    if (id) {
      // Update existing note in the database
      await pool.query(
        'UPDATE notes SET branch = $1, department = $2, semester = $3, serial_number = $4, course_code = $5, subject_name = $6, module_1 = $7, pdf = $8 WHERE id = $9',
        [branch, department, semester, serial_number, course_code, subject_name, module_1, pdf, id]
      );
    } else {
      // Insert a new note into the database
      await pool.query(
        'INSERT INTO notes (branch, department, semester, serial_number, course_code, subject_name, module_1, pdf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [branch, department, semester, serial_number, course_code, subject_name, module_1, pdf]
      );
    }
    res.redirect("/adminpanel"); // Redirect to admin panel after the operation
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// POST Route for editing notes (similar to uploading)
router.post("/adminpanel/edit", upload.single("pdf"), async (req, res) => {
  const { id, branch, department, semester, serial_number, course_code, subject_name, module_1 } = req.body;
  
  // Get S3 file URL for uploaded or existing file
  const pdf = req.file ? req.file.location : req.body.current_pdf;

  try {
    await pool.query(
      'UPDATE notes SET branch = $1, department = $2, semester = $3, serial_number = $4, course_code = $5, subject_name = $6, module_1 = $7, pdf = $8 WHERE id = $9',
      [branch, department, semester, serial_number, course_code, subject_name, module_1, pdf, id]
    );
    res.redirect("/adminpanel");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.post('/changeadminpassword', async (req, res) => {
  const { oldPassword, newPassword } = req.body;  // Extract the passwords sent from the client
  const adminData = req.session.admin;
  
   

  // Ensure the session contains admin email
  if (!adminData || !adminData.email) {
      return res.status(403).json({ success: false, message: "Unauthorized: No admin email in session." });
  }

  const adminEmail = adminData.email;

  try {
      const result = await pool.query("SELECT * FROM userss WHERE email = $1", [adminEmail]);

      if (result.rows.length > 0) {
          const admin = result.rows[0];
          const storedPassword = admin.password;

          // Ensure both passwords are provided and not empty
          if (!oldPassword || !newPassword) {
              return res.status(400).json({ success: false, message: "Old and new passwords are required." });
          }

           

          const isOldPasswordCorrect = await bcrypt.compare(oldPassword, storedPassword);

          if (isOldPasswordCorrect) {
              // Hash the new password before storing it
              const hashedNewPassword = await bcrypt.hash(newPassword, 10);

              // Update password in the database
              await pool.query("UPDATE userss SET password = $1 WHERE email = $2", [hashedNewPassword, adminEmail]);

               

              // Send a success response to the client
              return  res.redirect('/adminpanel');
          } else {
              // If old password is incorrect, send failure response
              return res.json({ success: false, message: "Old password is incorrect." });
          }
      } else {
          // If no admin is found, send failure response
          return res.json({ success: false, message: "Admin not found." });
      }
  } catch (err) {
      console.error("Error updating password:", err);
      res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});


  
router.post('/registeradmin', (req, res) => {
    const { email, password } = req.body;
  
    console.log('Received registration data:', { email, password }); // Log received data
  
    if (!email || !password) {
      console.log('Missing email or password');
      return res.json({ success: false, message: 'Email and password are required.' });
    }
  
    // Check if email already exists
    pool.query('SELECT * FROM userss WHERE email = $1', [email], (err, result) => {
      if (err) {
        console.error('Database query error:', err); // Log error
        return res.json({ success: false, message: 'An error occurred. Please try again later.' });
      }
  
      if (result.rows.length > 0) {
        console.log('Email already exists:', email);
        return res.json({ success: false, message: 'Email already exists.' });
      }
  
      // Hash the password before storing
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Password hashing error:', err); // Log error
          return res.json({ success: false, message: 'An error occurred while hashing the password.' });
        }
  
        // Insert the new admin user into the database
        pool.query('INSERT INTO userss (email, password) VALUES ($1, $2)', [email, hashedPassword], (err) => {
          if (err) {
            console.error('Database insert error:', err); // Log error
            return res.json({ success: false, message: 'An error occurred. Please try again later.' });
          }
  
          console.log('Admin registered successfully:', email);
          res.redirect('/adminpanel')
        });
      });
    });
  });

  router.post('/deleteuser/:id', async (req, res) => {
    const userId = req.params.id; // Retrieve the user ID from the URL
    
    try {
      // Perform the delete operation in the database using the provided ID
      const result = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      
      if (result.rowCount > 0) {
        // Successfully deleted, redirect back to the admin panel
        res.redirect('/adminpanel');
      } else {
        // If no rows were deleted (user not found), send an error
        res.status(404).send("User not found.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  router.post('/deleteuserlogins/:id', async (req, res) => {
    const userId = req.params.id; // Retrieve the user ID from the URL
    
    try {
      // Perform the delete operation in the database using the provided ID
      const result = await pool.query('DELETE FROM logins WHERE id = $1', [userId]);
      
      if (result.rowCount > 0) {
        // Successfully deleted, redirect back to the admin panel
        res.redirect('/adminpanel');
      } else {
        // If no rows were deleted (user not found), send an error
        res.status(404).send("User not found.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    }
  });  
  router.post('/deleteuserform/:id', async (req, res) => {
    const userId = req.params.id; // Retrieve the user ID from the URL
    
    try {
      // Perform the delete operation in the database using the provided ID
      const result = await pool.query('DELETE FROM forms WHERE id = $1', [userId]);
      
      if (result.rowCount > 0) {
        // Successfully deleted, redirect back to the admin panel
        res.redirect('/adminpanel');
      } else {
        // If no rows were deleted (user not found), send an error
        res.status(404).send("User not found.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    }
  }); 

  router.post('/deleteadminlogins/:id', async (req, res) => {
    const userId = req.params.id; // Retrieve the user ID from the URL
    
    try {
      // Perform the delete operation in the database using the provided ID
      const result = await pool.query('DELETE FROM adminlogins WHERE id = $1', [userId]);
      
      if (result.rowCount > 0) {
        // Successfully deleted, redirect back to the admin panel
        res.redirect('/adminpanel');
      } else {
        // If no rows were deleted (user not found), send an error
        res.status(404).send("User not found.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  router.post('/deleteadminusers/:id', async (req, res) => {
    const userId = req.params.id; // Retrieve the user ID from the URL
    
    try {
      // Perform the delete operation in the database using the provided ID
      const result = await pool.query('DELETE FROM userss WHERE id = $1', [userId]);
      
      if (result.rowCount > 0) {
        // Successfully deleted, redirect back to the admin panel
        res.redirect('/adminpanel');
      } else {
        // If no rows were deleted (user not found), send an error
        res.status(404).send("User not found.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).send("Internal Server Error");
    }
  });
export default router;
