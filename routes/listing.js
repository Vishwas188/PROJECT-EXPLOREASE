const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");//all the things thare are needed here will be transferred here as well


const {isloggedin}=require("../middleware.js")
 const {isowner}=require("../middleware.js")
 const {validatelisting}=require("../middleware.js");
 const listingcontroller=require("../controllers/listing.js");


 const multer=require("multer");
 const {storage}=require("../cloudconfig.js");
 const upload=multer({storage});




router.route("/")
.get(wrapasync (listingcontroller.index))//index route
.post(isloggedin,upload.single("listing[image]"),validatelisting,wrapasync(listingcontroller.postlisting));//req.file mein file ajege image ke sent from multer middleware





 //new route
router.get("/new",isloggedin,listingcontroller.rendernewform);//isko id ke upar rakha kioki nin to id samajhne lgta isko browser
 
 router.route("/:id")
 .get(wrapasync(listingcontroller.showlisting))//show route 
 .put( isloggedin,isowner,upload.single("listing[image]"),validatelisting,wrapasync(listingcontroller.editlisting))  //update route
 .delete(isloggedin, isowner,wrapasync(listingcontroller.deletelisting));


 
 
 

  
//isliye server side error ko handle krenge
 /*router.post("/listings", async (req, res,next) => {
    try{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
      }catch(err){
        next(err);//agar price mein alphabets dal diye to errror handle kr dia
      }
    
    });*/
  
        
    //edit route
    router.get("/:id/edit",isloggedin,isowner,wrapasync(listingcontroller.editform));
    
    
  
   
      
    
      
    
    

      module.exports=router;