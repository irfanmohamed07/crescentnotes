import express from "express";
import pool from "../Db/index.js"

const router = express.Router();

router.get('/contact',(req,res)=>{
    res.render('contact',{ user: req.session.user });
});

router.post('/contact',async(req,res)=>{
const name = req.body.name;
const email = req.body.email;
const message = req.body.message;

try{
    const result= await pool.query("INSERT INTO forms (name,email,message) VALUES ($1,$2,$3)",[name,email,message]);
    res.render('contact',{"error-message":"✅Thank you for contacting Us", user : req.session.user })
    
}
catch(error){
    console.log(error)
    res.render('contact',{"error-message":"Error submitting the form",user : req.session.user })
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
