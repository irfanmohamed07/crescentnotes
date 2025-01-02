import express from "express";
import pool from "../Db/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const checkResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      
      if (checkResult.rows.length > 0) {
        const user = checkResult.rows[0];
        const storedPassword = user.password;
  
        bcrypt.compare(password, storedPassword, (error, result) => {
          if (result) {
            // Set session data upon successful login
            req.session.isAuthenticated = true;
            req.session.user = { 
              email: user.email, 
              username: user.username 
            };
  
            // Insert the login data to the database if necessary
            pool.query("INSERT INTO logins (email) VALUES ($1)", [email]);
  
            // After login, redirect to the home page
            res.redirect('/');
          } else {
            // Password mismatch
            res.render('login', { "error-message": "Incorrect password" });
          }
        });
      } else {
        // Email not found
        res.render('login', { "error-message": "Email not found" });
      }
    } catch (error) {
      // Database error or other errors
      res.render('login', { "error-message": "Error occurred. Please try again" });
    }
  });
  

export default router;
