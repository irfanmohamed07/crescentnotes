import express from "express";
import pool from "../Db/index.js"

const router= express.Router();
 
router.get('/', (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');  
  }

 
  res.render('home', { user: req.session.user });
});

 
router.post('/notes', async (req, res) => {
  const { branch, department, semester } = req.body;
 
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');   
  }

  try {
    const result = await pool.query(
      `
      SELECT * 
      FROM notes 
      WHERE branch = $1 AND department = $2 AND semester = $3
      ORDER BY subject_name ASC, module_1 ASC
      `,
      [branch, department, semester]
    );

     
    res.render('home', { 
      user: req.session.user,   
      notes: result.rows,
      "message":"Scroll down to view Notes",
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).render('home', { 
      notes: [], 
      error: 'Internal Server Error' 
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send("Error logging out");
    }
    res.redirect('/');
  });
});

  

export default router;