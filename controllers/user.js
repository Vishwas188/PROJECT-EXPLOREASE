const user=require("../models/user");

module.exports.signupform=(req,res)=>{
    res.render("users/signup.ejs");//yahan pe views wala function use krne ke jrurat kioki eoh to alrrady ha app.js mein
}

module.exports.postsignup=async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new user({email,username});
    const registereduser=await user.register(newuser,password);
   
    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to ExploreEase");
        res.redirect("/listings");

    });
  
    }
    catch(e){
        req.flash("error",e.message);//jiski vi body mein honge jese boilerplate mein code likha uske upar flash message ajega
        res.redirect("/signup");
    }
}
module.exports.loginform=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postlogin=async (req,res)=>{// user pehle se database mein tha ya ni tha woh passport krta.for that we need to use a middleware passport.authenitcate jisme hum strategy bhejte apne and opts pass krte which is failure redirect which will redirect in failure to wherever we choose.failurelfash will be used to flash some messages
    req.flash("success","Welcome to ExploreEase");
    //res.redirect("/req.session.redirecturl");
    let redirecturl=res.locals.redirecturl || "/listings";
    
    res.redirect(redirecturl);
    
    }
module.exports.postlogout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/listings");
    })
}