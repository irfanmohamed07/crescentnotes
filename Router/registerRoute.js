import express from "express";
import bcrypt from "bcrypt";
import pool from "../Db/index.js";

const router=express.Router();
const saltRound=10;

router.get('/register',(req,res)=>{
    res.render('register');
})


router.post('/register',async(req,res)=>{
    const email= req.body.email;
    const password = req.body.password;
     
    try{
         const checkResult= await pool.query("SELECT * FROM users WHERE email = $1",[email]);

         if(checkResult.rows.length > 0){
            res.render('register',{"error-message":"Email already exists"});
         }
         else{
            bcrypt.hash(password,saltRound,async(error,hash)=>{
                 const result = await pool.query("INSERT INTO users (email,password) VALUES ($1,$2)",[email,hash]);
                 res.redirect("/login");
            })

         }

    }
    catch(error){
             console.log(error)
    }

});

export default router;