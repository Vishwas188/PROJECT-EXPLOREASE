
    
const Listing=require("../models/listing");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');//services chahuye the geocoding ke to tilesets hata ke geocoding kr dia
const maptoken=process.env.MAP_TOKEN;
const geocodingclient=mbxgeocoding({accessToken:maptoken});


/*module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});//sari listing ajenge 
    res.render("listings/index.ejs",{alllistings});
    //isko id ke upar is lyi rakha kioki woh smajah rha new vi ek id ha to usko :id get req ke uoar rakha
 };*/
 module.exports.index = async (req, res) => {
    //const country = req.query.country;
    //let category = req.query.q;

    const alllistings = await Listing.find();

   /* if (country) {
        category = country;
        let countryListing = category
            ? alllistings.filter((listing) => listing.country.toLowerCase() === category.toLowerCase())
            : alllistings;

        if (countryListing.length == 0) {
            req.flash("error", "not available");
            return res.redirect("/listings");  // Return after redirect
        }

        return res.render("listings/index.ejs", { alllistings: countryListing });  // Return after render
    }

    let category1 = category
        ? alllistings.filter((listing) => listing.category === category)
        : alllistings;

    if (category1.length == 0) {
        req.flash("error", "not available");
        return res.redirect("/listings");  // Return after redirect
    }*/

     res.render("listings/index.ejs", { alllistings} );  // Return after render
};

 module.exports.rendernewform= (req,res)=>{
    
     res.render("listings/new.ejs");
 
 };
 module.exports.showlisting=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
   
    if(!listing){
       req.flash("error","Listing you requested does not exist");
       res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});



 }

 module.exports.postlisting=async(req,res,next)=>{//jab is route pe req ayege to validate kra jayega listing ko
    /*if(!req.body.listing){
        throw new expresserror(400,"send valid data for listing")//handling error by sending custom message.Hoppscotch se send kre dekh lena
    }//but yeh jo ha individual details pe ni focus krta matlab hum abhi vi description aur price wagerah skip kr skte. to uske liye neeche soln

       

        if(!req.body.listing.description){
            throw new expresserror(400,"Description is missing")
        }
        if(!req.body.listing.title){
            throw new expresserror(400,"title is missing")
        }
        if(!req.body.listing.location){//yeh async task ni ha tabhi throw kra sirf aur next ke andar ni
            throw new expresserror(400,"Location is missing")
        }*/
        /*IMp:- yeh sab bar bar if krne ke jagah we can use npm tool joi which will validate schema for us. Joi is used for server side validation ke schema check krega ke follow ho rha ke ni. */
       /* let result=listingschema.validate(req.body);//using joi.
        if(result.error){
            throw new expresserror(400,result.error);
        }*/
     let response= await geocodingclient.forwardGeocode({//.then use kran di  lod ni kioki async function to await use kr lenmge
        query:req.body.listing.location,
        limit:1//1 he possible coordinates ayenge ni to 5 tk vi aa skte koiki locations bahut specific vi hote to vague koi locn doge to bahut sare latitude aur longitude ke combination hote jo ke 1 result mein ni a a skte

       })
       .send();
       
       
        let url= req.file.path;
        let filename=req.file.filename;
        
        const newListing = new Listing(req.body.listing);

        console.log(newListing);
        
        if (!newListing.geometry) {
            console.log("geometry not there");
            }
        
        newListing.geometry=response.body.features[0].geometry;
        newListing.owner=req.user._id;//passoport ka function req.user ke andar id user ke jo chla rha session se pta lgega jo
        newListing.image={url,filename};
        let savedlisting=await newListing.save();
        console.log(savedlisting);
        req.flash("success","New Listing Created!");//yahan pe use hoga flash message
        res.redirect("/listings");
    //but hume ise middleware mein convert krna.uske liye hum ise function mein convert krenge
      
    
    }
    module.exports.editform=async (req,res)=>{//kio vi async function ha use wrap async krde taki server na stop ho
        let {id}=req.params;
       let listing= await Listing.findById(id);
      
       if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
     }
     let originalimageurl= listing.image.url;
     originalimageurl=originalimageurl.replace("/upload","/upload/h_250,w_250");//this is done to reduce the image's quality


        res.render("listings/edit.ejs",{listing,originalimageurl});
    
    }


    module.exports.editlisting=async(req,res) => {
        /*if(!req.body.listing){
            throw new expresserror(400,"send valid data for listing")//handling error by sending custom message.Hoppscotch se send kre dekh lena. Hoppscotch se is lyi kioki site pe hum send ni kr pa re empty data.
        }*/ //not needed once validate listing given
        

        let { id } = req.params;
        let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });//iske andar sare paramters ha jisko deconstruct krke inko individual values mein convert krenge jisko hjum apne naye updated value ke andar pass kr denge
        if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
        }
        req.flash("success","Listing Updated!");
        res.redirect(`/listings/${id}`);
      }


    module.exports.deletelisting=async(req,res) => {
        let { id } = req.params;
        let deletedlisting=await Listing.findByIdAndDelete(id);//iske andar sare paramters ha jisko deconstruct krke inko individual values mein convert krenge jisko hjum apne naye updated value ke andar pass kr denge.Also if u delete the listing , ise delete middelwqare call hojega defined in listing.js
        console.log(deletedlisting);
        req.flash("success","Listing Deleted!");
        res.redirect("/listings");
      }
      