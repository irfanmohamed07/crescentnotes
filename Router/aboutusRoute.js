import express from "express";

const router = express.Router();

router.get('/aboutus',(req,res)=>{
    res.render('aboutus',{user : req.session.user });

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
