const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,

    }
})
userSchema.plugin(passportLocalMongoose);//automaticvally username ,hashing ,salting anf hash pass implement kr deta.change password and authentication ke methods vi apne aap implement kr dega.
module.exports=mongoose.model("user",userSchema);