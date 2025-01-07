if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}




const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const expresserror=require("./utils/expresserror.js");
 const flash=require("connect-flash");
 const passport=require("passport");
 const localstrategy=require("passport-local");
const user=require("./models/user.js");
const Listing=require("./models/listing");
const Mongostore=require("connect-mongo");

const dburl=process.env.ATLAS_DB_URL;






const userrouter=require("./routes/user.js");
const reviews=require("./routes/reviews.js");
const listings=require("./routes/listing.js");//to get all listing routes

app.set("view.engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const mongodburl="mongodb://127.0.0.1:27017/airbnb";


main().then((req,res)=>{
    console.log("connection successful");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect( dburl);
}

const store=Mongostore.create({
    mongoUrl:dburl,
    crypto:{
       secret:process.env.SECRET,
    },
    touchafter: 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);

})

const sessionoptions={
    store,
    secret:process.env.SECRET,//secregt used to sign the session id cookie that will be stored in servers
    resave:false,
    saveUninitialized:true,
    cookie:{//this is used he
        expires:Date.now()+ 7*24*60*60*1000,//1000 ms is for ms
        maxAge: 7*24*60*60*1000,
        httpOnly:true,//done dor security purpose
    }
}
 



app.use(session(sessionoptions));
app.use(flash());//flash pehle ayega routes se
 

app.use(passport.initialize());//required ha yeh middleware use krna
app.use(passport.session());//a web application needs the ability to identify users as they browse from page to page. this series of req and res, each associated with the same user is known as a session.is lyi yeh middleware use krte
passport.use(new localstrategy(user.authenticate()));//uske bad yeh likhna isi order mein.koi vi user aaye woh local strat ke according authenticate ho 

passport.serializeUser(user.serializeUser());//yeh vi required ha to serialize users into the session.storinf them serially
passport.deserializeUser(user.deserializeUser());//session chod dia to deserialise kr dena




app.use((req,res,next)=>{
    res.locals.success=req.flash("success");//is se message save hojega res.locals.success mein
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();//next ko bulayenge to aage ke commands run hojenge to index.js fir se render hoga and res.locals se hum use variables bhej denge jisme flash ka message required tha.
})

app.get("/demouser",async(req,res)=>{
    let fakeuser=new user({
        email:"student@gmail.com",
        username:"vishwas",//automatically passport uservi dal delta schema mien.
    });
   let registereduser= await user.register(fakeuser,"helloworld");//yeh user ke pas function hota jise yeh fake user hum save krwa denge and yeh password ke sath.
   res.send(registereduser);
})




app.use("/",userrouter);
app.use("/listings/:id/reviews",reviews);
app.use("/listings",listings);





app.listen(8080,()=>{
    console.log("listening");
})
/*app.get("/testlisting",async (req,res)=>{
   let samplelisting=new Listing({
    title:"my new villa",
    description:"by the beach",
    price:"1200",
    location:"calangute,goa",
    country:"India",
})
    await samplelisting.save();//await krke sirf yeh chlega fir he neeche wale chlenge    
    console.log("sample was saved");
    res.send("successful testing");

});*/





  app.all("*",(req,res,next)=>{
    next(new expresserror(404,"page not found"));//error ke jagah class bhejdi poori jo utils mein banaye the
  })//if route doesnt match any then we will pass the err to below middleware


  app.use((err,req,res,next)=>{
   // res.send("Something went wrong");//but iski jagah kuch error bhej sktr.IN UTILS
   let {status=500,message="something went wrong"}=err;//status code 500t ab hoga agar error mein koi status ninaya
   res.status(status).render("error.ejs",{message});//to beautify the error
   


  });





  /*IMp-mene all wala dalne bad search kra /news jo ke is not a route but due to /listing/:id it thougtht news was an id to usne async error throw kr dia */
 
