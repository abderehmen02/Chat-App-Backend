const express  = require("express");
const {readFileSync}  = require('fs')
const app = express()
const path = require("path") ;
app.get("/image/:id" , (req , res)=>{
    const file = readFileSync(path.join(__dirname , 'uploads' , req.params.id))
    res.contentType('image/png')
    res.send(file)
})
const cors = require("cors")

const jwt = require('jsonwebtoken')
const io = require("socket.io")(4000 , {
    cors: {    origin: "http://localhost:3000" }
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())
const MyRouter = require("./routes/index")
const connectdb = require('./db/connect.js');
const { dirname } = require("path");
require("dotenv").config() 

app.get('/messages'  , (req , res )=>{
    res.send('wzld')
})
app.use("/api/v1" , MyRouter )
const PORT = process.env.PORT || 2000
const ServerListen = async ()=>{
 try{
      await connectdb(process.env.MONGO_DB_URL)
      app.listen(PORT , ()=>{console.log("listening on port " + PORT)})

 }
 catch(error){
     if(error){
         console.log(error)
     }
}
} 

io.on('connection', (socket) =>{
   socket.on("sendMessage"  , (receiverUserName , senderUserName , message ,likes=[]) =>{
       console.log(senderUserName);
   io.emit(`receiveMessage${receiverUserName}` , senderUserName , message , likes )
   })
   socket.on("typing" ,(otherUserName  , token , isTyping)=>{
jwt.verify(token ,  process.env.TOKEN_SECRET , (err , user)=>{
    if(err){
        console.log("jwt err %o" , err ) ;
     }
     else if (user){
         console.log("user username")
console.log(user.userName)
         io.emit(`typing${otherUserName}` , user.userName , isTyping ) 
     }
} )

   })
})


ServerListen()
