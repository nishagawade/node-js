const express = require('express');
const connectDb = require('./database.js');
const User = require('./models/User.js');
const app = express();
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const {userAuth }  = require('./middlewares/auth')


app.use(express.json()) //will convert json into javascript object
app.use(cookieParser());



app.listen(3000 , ()=>{
    console.log("server running successfully")
    
})



app.get('/testing', (req, res) =>{
   res.send("testing successfully")
})

//post requesst

app.post('/Signup', async(req, res) =>{

    // const user = new User(req.body) //create a new instance of a data model which has been received from the api
    // console.log(req.body);

   // const password = req.body.password

     try{

        const { name, age, email, hobbies, password}  = req.body;
  

        const passwordHash = await bcrypt.hash(password , 10) ;// salt is a plain string which is used to create password encryption 10 is no of salt rounds
        console.log("ecrypted password",passwordHash )
        const user = new User({  //saving an instance of a user in db
            name ,
            age ,
            email ,
            hobbies ,
            password : passwordHash
         })
    
         const savedUser = await user.save();
        //  const token = await savedUser.getJWT();
        //  console.log("token", token)
    
        // res.cookie("token", token , {
        //     expires : '7d'
        // })
    
        res.json({
            message : "data added successfully", 
            data : savedUser
        })
    
        // await user.save();
        // res.send("data added successfully")
        // console.log("data added successfully")
    }catch(err){
       res.status(400).send("Error saving the data" + err.message)
    }
})

//getting a user by its email id 

app.get('/user2', async(req, res) =>{

    const userEmail = req.body.email

    try{
        const user = await User.find({ email : userEmail});
        res.send(user)
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

//how to create a delete api 

app.delete('/user', async(req, res)=>{
    const userID = req.body.userID;

    try{
        const user = await User.findByIdAndDelete(userID);
        res.send("user deleted successfully")
    }catch(err){
        res.status(400).send("something went wrong")
    }
})

//getting all the users from the database using feed api
app.get('/feed', async(req, res)=>{

   try{
     const users = await User.find({});
     res.send(users)
     res.send("users generated successfully")
   }catch(err){
      res.send(400).send("something went wrong")
   }
})

//updating my name using patch api

app.use('/update' , async (req, res) =>{
    //dont allow email id to update
    



    const userId = req.body.userId;
    const data = req.body

    // const allowedUpdates = ['name', 'age', 'hobbies']

    // const isAllowedUpdate = Object.keys(data).every((k)=>{
    //     allowedUpdates.includes(k)
    // })

    // if(!isAllowedUpdate){
    //     throw new Error("update not allowed")
    // }

    try{
       const user = await User.findByIdAndUpdate({_id : userId}, data);
       res.send(user)
       res.send("user updated successfully")
    }catch(err){
       res.status(400).send("something went wrong")
    }
})

//login api 

app.post('/login', async(req, res)=>{


    try{

    const {email, password} = req.body;

    const user =await  User.findOne({email : email});
    if(!user){
        throw new Error("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid){

        const token = await jwt.sign({_id : user._id}, 'DEVTINDER@5267YEUNFHETY' , {
            expiresIn : '8h'
        })
        console.log("token", token)

        // res.cookie("token", token);
        res.cookie("token", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });
        console.log("cookie", req.cookies)
       
       
    }else{
        throw new Error("Invalid credentials")
    }

    res.json({
        message : "login successful"
    })

    }catch(error){
        res.status(400).send("something went wrong")
    }

    

})

//get profile 

app.get('/profileView', userAuth,  async(req, res)=>{
    //while getting any request, the token will be verified , whether who is the user
    // const cookie = req.cookies;
    // const {token} = cookie
    // const decodedMessage = await jwt.verify(token, 'DEVTINDER@5267YEUNFHETY');
    // const {_id} = decodedMessage;

    try{
        const userId = await User.findById(_id);
    res.send(userId)
    }catch(err){
       res.status(400).send("something went wrong")
    }

   

})

//logout api

app.post('/logout', async(req, res)=>{

    const userId = req.user
})




connectDb()
.then(()=>{
    console.log("res added successfully")
}).catch((err)=>{
    console.log(err, "there is an error ")
}) 

