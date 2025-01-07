const Joi = require('joi');

module.exports.listingschema = Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image:Joi.string().allow("",null),
        category:Joi.string().required(),


    }).required(), //iska matlab yeh ha listing nam ke object hamesha required hone he chahiye
});

module.exports.reviewschema = Joi.object({
    review:Joi.object({//review nam ke cheez hone he chahiye
        rating:Joi.number().required().min(1).max(5),//these are all object ke key value pairs yeh vi required hone chahiye
        comment:Joi.string().required(),
        


    }).required(),
})