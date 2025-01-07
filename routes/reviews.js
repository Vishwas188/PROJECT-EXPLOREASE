//same reviews ke liye alagh file location bana di routes ke liye
const express=require("express");
const router=express.Router({mergeParams:true});//merge params for letting app.js id params to reach child route that is revuew.js routes.
const wrapasync=require("../utils/wrapasync.js");

const review=require("../models/review.js");
const {validatereview}=require("../middleware.js")
const Listing=require("../models/listing.js");
const {isloggedin}=require("../middleware.js");
const {isreviewauthor}=require("../middleware.js");

const reviewcontroller=require("../controllers/reviews.js");




  //Reviews post
 router.post("/",isloggedin,validatereview,wrapasync(reviewcontroller.postreview))//async hoga kioki db mein store krayenge


//delete review route
router.delete("/:reviewid",isloggedin,isreviewauthor,wrapasync(reviewcontroller.destroyreview));
module.exports=router;  

//imp:- common p[art nikal lete routes mein jese listings ke liye listinfs nikal lia. same way reviews ke liye listings/:id/reviews nikal lia