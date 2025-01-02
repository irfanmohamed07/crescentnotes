import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { checkAuthenticated,checkAdminAuthenticated} from "./middleware/authmiddleware.js"
import loginRoute from "./Router/loginRoute.js"
import registerRoute from "./Router/registerRoute.js";
import homeRoute from "./Router/homeRoute.js";
import contactRoute from "./Router/contactRoute.js";
import aboutusRoute from "./Router/aboutusRoute.js";
import userForgetPasswordRoute from "./Router/userForgetPasswordRoute.js";
import adminloginRoute from "./Router/adminloginRoute.js";
import adminpanelRoute from "./Router/adminpanelRoute.js";
import adminForgetPasswordRoute from "./Router/adminForgetePasswordRoute.js";

const app= express();
const port = 3000;
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, secure: false } // If using HTTPS, set secure to true
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use('/',adminloginRoute);
app.use('/',loginRoute);
app.use('/',registerRoute);
app.use('/',userForgetPasswordRoute);
app.use('/',adminForgetPasswordRoute)
app.use('/',checkAdminAuthenticated,adminpanelRoute);
app.use('/',checkAuthenticated,homeRoute);
app.use('/',checkAuthenticated,contactRoute);
app.use('/',checkAuthenticated,aboutusRoute);


app.use((req, res, next) => {
    res.status(404).render('404');
  });
  
app.listen(port,()=>{
    console.log(`app is listening on port ${port}`)
})


