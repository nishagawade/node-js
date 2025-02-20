const jwt = require("jsonwebtoken");
const User = require("./models/user");

const userAuth = async(req, res, next) =>{

    try{

        const {token} = req.cookies

        if(!token){
          res.status(400).send("Please login")
        }
      
      
      
        const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
        const {_id} = decodedMessage;
      
        const user = await User.findById(_id);
      
        if(!user){
          res.send("user not found")
        }

        req.user = user  //whatever user we have found in database , you have attached into the request
      
        next()

    }catch(err){
        res.status(400).send("something went wrong" + err.message)
    }

}

module.exports = {
    userAuth
}