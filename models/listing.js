const mongoose=require("mongoose");
const schema=mongoose.Schema;//nam rakha taki bar bar mongoose.schema na rakhna pde
const review=require("./review.js");


const listingschema=new schema({
  title:{
     type: String,
     required:true,
  },
  description:String,
  image: {
      url:String,
      filename:String,
    },

  price:Number,
  location:String,
  country:String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref:"review",
    },

  ],

  owner: {
    type:schema.Types.ObjectId,
    ref:"user",
  },
  category: {
     type:String
  },

  geometry:{
    type:{
    type:String,
    enum:["Point"],
    
    required:true,
  },

  coordinates : {
    type: [Number],
    required:true,
  },
}

});


listingschema.post("findOneAndDelete",async(listing)=>{
  if(listing){
await review.deleteMany({_id:{$in:listing.reviews}});//is id ko deletekr denge
  }
})
const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;

