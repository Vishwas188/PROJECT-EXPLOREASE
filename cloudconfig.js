const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_API_SECRET

})

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"explorease_dev", //kahan pe file store hoge
       allowedFormats:["png","jpg","jpeg"], 
   
    },
});

module.exports={
    cloudinary,
    storage,
}