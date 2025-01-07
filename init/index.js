const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initdata=require("./data.js");


main().then((req,res)=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
}

const initDB=async()=>{
    await Listing.deleteMany({});//agar koi faltu chez pdi to uda dop starting mein
   initdata.data= initdata.data.map((obj)=>({...obj,owner:'66af1d2ec4f297f157defe78'}));
   /*initdata.data=initdata.data.map((obj)=>({...obj,image:"https://besthotelview.com/img/hotel/in/itc-maurya-new-delhi.jpg"}))*/ //also works
    await Listing.insertMany(initdata.data);//ya to ekek object bana ke new listing krke object bana skta ya aise bana skta
    console.log("data was inserted");

}
initDB();
