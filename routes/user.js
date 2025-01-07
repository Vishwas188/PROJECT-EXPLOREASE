/*1) get page banaya then post.
2) post mein woh sab normal cheese kre but errors aa skte kuch jese users already exists or empty username bhej dia wagera to uske liye wrap async to use kra but woh ajeeb sa error dikjayega. to try and catch use kr re for custom errors
3) we want ke sign up ke upar he error aje rather hum ek aur page pe chl jaye jahan wrap async hum error dikhaye.uske liye flash use krenge with try and catch*/
const express=require("express");
const router=express.Router();
const user=require("../models/user.js")
const wrapasync=require("../utils/wrapasync");
const passport=require("passport");
const {saveredirecturl}=require("../middleware.js");
const usercontroller=require("../controllers/user.js");

router.get("/signup",usercontroller.signupform)


router.post("/signup",wrapasync(usercontroller.postsignup));

router.get("/login",usercontroller.loginform);

router.post("/login",saveredirecturl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true,}),wrapasync(usercontroller.postlogin
));
//but ab ek prob ha kioki agar hum normal login kren to woih chlega ni kioki uske liye to requested url aya he ni jahan pe redirect krna chahtge

router.get("/logout",usercontroller.postlogout);

module.exports=router;
//pass-yoitsme.