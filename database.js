const mongoose = require('mongoose');

//connect database of mongodb into database.js and then connect it into app.js

const connectDb = async () =>{
    // await mongoose.connect('localhost:27017')
    await mongoose.connect('mongodb://localhost:27017/userInfo')
}


connectDb().then(()=>{
    console.log("cluster connection is successful")
}).catch ((err)=>{
    console.log("err", err)
    console.log("connection is not successfull")
})

module.exports = connectDb