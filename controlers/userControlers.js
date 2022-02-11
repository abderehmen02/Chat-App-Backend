const AsyncWraper = require("./asyncWraper")
const UserSchema = require("../db/models/user")
const jwt = require("jsonwebtoken")
const {hashSync , compare } = require("bcryptjs")

const AutorizeUser = (req , res , next)=>{
  console.log("authorising user")
  console.log(req.headers["authorization"])
  const token = req.headers["authorization"].split(" ")[1]
  console.log(token)
jwt.verify(token , process.env.TOKEN_SECRET , (err , user)=>{
    if(err){ 
return       res.status(404).json({"type" : "failed" , "error" : err })
}
if(user){
 req.user = user ;
 next()
}}
  )
  
}


const generateToken = (data)=>{
 return   jwt.sign({userName: data.userName , rooms: data.rooms , name : data.name , image: data.image } ,process.env.TOKEN_SECRET ) 
}

const CreateUser = AsyncWraper( async(req , res , next)=>{  
req.body.passWord = hashSync(req.body.passWord , 8 )
const data = await UserSchema.create(req.body)
if(data){ res.status(201).json({"status" : "success"}) }
})
const Login = AsyncWraper( async (req , res , next)=>{
  const data = await UserSchema.findOne({ userName :  req.body.userName}) 
    console.log(jwt.sign({userName: data.userName , image: data.image , name : data.name} , process.env.TOKEN_SECRET))
  compare(req.body.passWord , data.passWord  ).then((IsTrue)=>{
if(IsTrue === true){
    res.status(200).json({"type" : "success" , "data" : JSON.stringify(data) , "token" : generateToken(data) })}
else{
    res.send(404).json({"type" : "failed" , "error" : "authentification error"})
}
})
})
const DeleteUser = AsyncWraper(async (req , res, next)=>{
    await UserSchema.findOneAndDelete({userName: req.user.userName})
    res.status(200).json({'type' : 'success' })
})
const UpdateUser = AsyncWraper(async (req , res , next)=>{
    await UserSchema.findOneAndUpdate({userName: req.user.userName} , req.body )
    res.status(200).json({"type" : "success"})
})
module.exports = { CreateUser , UpdateUser , Login , DeleteUser , AutorizeUser}