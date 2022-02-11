const  express  = require("express");
const cors = require("cors") 
const app = express()
app.use(express.json())
app.use(cors())
const MyRouter = require("./routes/index")
const connectdb = require('./db/connect.js')
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

ServerListen()