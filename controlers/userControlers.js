const AsyncWraper = require("./asyncWraper")
const UserSchema = require("../db/models/user")
const jwt = require("jsonwebtoken")

const {hashSync , compare } = require("bcryptjs")
const multer = require("multer") ;
const AutorizeUser = (req , res , next)=>{
const token = req.headers["authorization"].split(" ")[1]
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
 return   jwt.sign({userName: data.userName , rooms: data.rooms , name : data.name , image: data.image  } ,process.env.TOKEN_SECRET ) 
}



const CreateUser = AsyncWraper( async(req , res , next)=>{  
req.body.passWord = hashSync(req.body.passWord , 8 )
try{
const data = await UserSchema.create(req.body)
if(data){
 
  res.status(201).json({"type" : "success" , "data" : data , "token" : generateToken(data) }) } }
catch(err){
res.status(400).json({"type" : "failed" , "error" : "userName" })  
}
})




const Login = AsyncWraper( async (req , res , next)=>{
   const data = await UserSchema.findOne({ userName :  req.body.userName}) 
  if(!data){
res.status(404).json({"type" : "failed" , "error" : "can not find user"})
return   ; 
  }
compare(req.body.passWord , data.passWord  ).then((IsTrue)=>{
if(IsTrue === true){
    res.status(200).json({"type" : "success" , "data" : JSON.stringify(data) , "token" : generateToken(data) })
}
else{
    res.status(404).json({"type" : "failed" , "error" : "authentification error"})
}
})
})





const DeleteUser = AsyncWraper(async (req , res, next)=>{
   const data =  await UserSchema.findOneAndDelete({userName: req.user.userName})
   if(data){
    res.status(200).json({'type' : 'success' }) }
    else res.status(500).json({'type' : 'failed' , error: 'somme error happened in the server'})
})





const UpdateUser = AsyncWraper(async (req , res , next)=>{

    if(req.body.image){
req.body.image = req.file.filename ; 
    }
const oldData = await UserSchema.findOne({userName : req.user.userName})
// if we found the user on the database  ; 
if(oldData  ){
compare(req.body.passWord , oldData.passWord).then( async (isTrue ) =>{
// if the the password is correct
  if(isTrue){

// deleting the password from the body inorder not to save it on the database ; 
const oldPassword = req.body.passWord  ;  
delete req.body.passWord  ;
const newData  = await  UserSchema.findOneAndUpdate({ userName :  req.user.userName } , req.body  , {new: true} ) ;
// if we get the new data ; 
    if(newData){
(req.body.newPassword || req.body.userName ) ? res.status(200).json({"type" : "success"   ,  "data" : newData  })  :   res.status(200).json({"type" : "success" ,"data" : newData  } )  ;
}
// we do do not get the data
else{
  res.status(500).json({"type" : "failed" , "error" : "something went wrong , can not get your new data"})
}

}
else{
  res.status(404).json({"type" : "failed" , "error" : "authontification error"})  ; 
}
})
}
else {
  res.status(500).json({"type"  : "failed" , "error" :  "can not find this user in the database" })
}
})





const FindUsers = AsyncWraper(async(req , res , next)=>{
const regexp = new RegExp("^"+ req.params.userName);
 const data =  await UserSchema.find({userName: regexp })
  res.status(201).json({ "type" :"success" , "data" : data })
})



const FindUserWithInterests = AsyncWraper(async(req , res , next)=>{
  const interests = req.query.interests ; 
  const interestsArray  = interests.split(",")  ; 
  const usersWithSameInterests = await UserSchema.find( { interests: { $in: interestsArray } } )

if(usersWithSameInterests || usersWithSameInterests.length === 0  ){
  res.status(200).json({"type": "success" , "data" : {usersWithSameInterests: usersWithSameInterests.map(user=>{
return {    name: user.name , 
    id: user.id, 
  interests: user.interests ,
  userName: user.userName ,
  image : user.image
  }
  })} })
}
else{
  res.status(400).json({"type" : "failed" , "error" : " some error happened" })
}  
})




const FindOneUser = AsyncWraper( async (req , res)=>{
  const userName = req.params.userName ;
  const user = await UserSchema.findOne({userName: userName})
  user.password = "" ; 
   if(user){
     res.status(200).json({"type"  : "success" , "data" : user})
   }
   else {
     res.status(400).json({"type" : "failed" , "data" : "we can not find the user "})
   }
})



// setting multer settings

const upload = multer({dest : 'uploads'});
const uploadMiddleWare = ()=>{
    return upload.single('image')
}

const updateProfile =  async (req , res )=>{
const oldData = await UserSchema.findOne({userName : req.user.userName})
if(oldData && await compare(req.body.passWord , oldData.passWord )){
  if(req.body.newPassword) { req.body.passWord = hashSync(req.body.newPassword , 8 )  ;
  }
  else{ delete req.body.passWord }
const newData  = await  UserSchema.findOneAndUpdate({ userName  : req.user.userName } , req.body  , {new : true} ) ;
if(newData){
 res.status(200).json({"type" : "success"  , "data" : newData  })  ; 
}
else{
  res.status(500).json({"type" : "failed" , "error" : "can not get the new user from the database"})
}    
}
else res.status(404).json({"type"  : "failed"  , "error"  : "authontification error"})
}
const uploadProfileImage = async (req, res )=>{
const newUser = await UserSchema.findOneAndUpdate({userName: req.user.userName } , {image: req.file.filename} , {new : true} )
return res.status(201).json({"type" : "success" , "data": {"image" : newUser.image } })
}
module.exports = {updateProfile , upload   , uploadMiddleWare , CreateUser , UpdateUser , Login , DeleteUser , AutorizeUser , FindUsers , FindUserWithInterests , FindOneUser , uploadProfileImage }