const Listing=require("../models/listing");
const review=require("../models/review")//inko use kr re ha na neeche routes mein to require kr re

module.exports.postreview=async(req,res)=>{


    let listing=await Listing.findById(req.params.id);
    let newreview=new review(req.body.review);//comment and rating dono pass hojayenge review andaf.YEH same bat hoge ke new review ke andar object ke details paate but rather isme hum unke form se ayi hue details ko bracket mein pass kr re
    newreview.author=req.user._id;
   
    listing.reviews.push(newreview);
   await newreview.save();//dono ko save krna pdega kioki dono collections ha
   await listing.save();//agar koi existing document ke andar changes krte to uske liye save ko call krna pdta whcih is itself an async function.

    req.flash("success","New Review Created");
    res.redirect(`/listings/${listing.id}`);//listing jo uparr nikalo ha
 
  };

  module.exports.destroyreview=async(req,res)=>{
    let {id,reviewid}=req.params;

    
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});//pull operator removes from an existing array all instance of a value or values that match a specified condition. reviews array se remove krna chahte usi remove id ko
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
};