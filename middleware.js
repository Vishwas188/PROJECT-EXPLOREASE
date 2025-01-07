const Listing=require("./models/listing.js");
const expresserror=require("./utils/expresserror.js");//for validate schema
const {listingschema}=require('./schemaa.js');
const {reviewschema}=require('./schemaa.js');
const review=require("./models/review");


module.exports.isloggedin = (req, res, next) => {
    // These pages don't need login
  

    // If not logged in, redirect to login
    
    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "You need to log in to use this feature");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirecturl=(req,res,next)=>{//middleware bana re
    if(req.session.redirecturl){
        res.locals.redirecturl=req.session.redirecturl;


    }
    next(); 
};
module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
     req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
    }
    next();
    
};
module.exports.validatelisting=(req,res,next)=>{//middleware mein convert kr dia
    let {error}=listingschema.validate(req.body);//using joi.
        if(error){
            let errmsg=error.details.map((el)=>el.message).join(","); //har ek error ka message extract kr re and unhe join kr re through ,
            throw new expresserror(400,errmsg);//yeh wrap async handle klrega
        }else{
            next();//aage jo commands woh poori kro
        }
}
module.exports.validatereview=(req,res,next)=>{//middleware mein convert kr dia
    let {error}=reviewschema.validate(req.body);//using joi.
        if(error){
            let errmsg=error.details.map((el)=>el.message).join(","); //har ek error ka message extract kr re and unhe join kr re through ,
            throw new expresserror(400,errmsg);
        }else{
            next();//aage jo commands woh poori kro
        }
};
module.exports.isreviewauthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let Review= await review.findById(reviewid);
    if(!Review.author.equals(res.locals.curruser._id)){
     req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
    }
    next();
    
};
