module.exports=(fn)=>{//we are making a utils folder jike andar aise functions bana re that we'll use if we want to.This we are making to replace try catch
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}