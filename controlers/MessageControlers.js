const AsyncWraper = require("./asyncWraper")
const messagesSchema = require("../db/models/messages")
const userSchema = require("../db/models/user")  
const roomSchema = require("../db/models/room")     




const CreateMessage = AsyncWraper( async (req , res , next)=>{
if(req.user.rooms.includes(req.body.receiver)){
 const room = await roomModel.findOneAndUpdate({
     $or: [
            { FirstMember: req.body.receiver , SecondMember : req.user.usesrName},
            { FirstMember: req.user.userName , SecondMember: req.body.receiver  }
          ]
} , { $push: { Messages:   { Sender : req.user.userName , Message: req.body.Message  }  }}
)
res.status(200).json({"type" : "success" , "data" : room })

}
else{
  const newUser = userSchema.findOneAndUpdate({
    userName : req.user.userName , 
  })
}
}
)

const DeleteMessage = AsyncWraper(async (req , res , next)=>{
const message = await messagesSchema.findOne({_id: req.params.id})
const newmessage =  await messagesSchema.findOneAndUpdate({_id: message._id}  , {visibles : message.visibles.filter(item =>{return item !== req.user.userName }) } )
res.status(200).json({"type" : "success" , "newmessage": newmessage  })
} )



const sendRequest = AsyncWraper( async (req , res )=>{
if(req.user.userName === req.body.userName){
  return res.status(400).json({"type" : "failed" , "error" : "you can not send firend request to yourself"})
}

const senderObject = {
  name : req.user.name ,
  userName : req.user.userName  , 
  image: req.user.image
}
const receiverObject = {
  name : req.body.name , 
  userName : req.body.userName ,  
  image : req.body.image
}
// add the sender to the receiver document (in the database) at the request received array 
const newUserReceiver = await userSchema.findOneAndUpdate({
  userName: req.body.userName
}  , { $push: { requestsReceived: senderObject } } , 
{new : true  }
)
// add the receiver to the sender documnet (in the database) at the requests send array
const newUserSender = await userSchema.findOneAndUpdate({
  userName: req.user.userName
}  , { $push: { requestsSent : receiverObject } } , 
{new : true  }
)

// check if we succeded to add the sender to the receiver document and the receiver to the sender document 
if( newUserReceiver.requestsReceived.some(request =>{
  return request.userName === req.user.userName 
}) && newUserSender.requestsSent.some(request=>{
  return request.userName === req.body.userName
}) ){
    res.status(201).json({"type" :"success" , "data" : newUserSender})
  return
}
res.status(400).json({"type" : "failed" , "error" : "somme error happened in the database"})
})
const acceptRequest = AsyncWraper( async (req , res)=>{
  if(req.user.userName === req.body.userName) return res.status(400).json({"type" : "failed" , "error" : "you can not accept yourself"})
// checking if the sender actaully sends the request

const senderUser = await userSchema.findOne({userName  : req.body.userName}) 
if(senderUser.requestsSent.some(request =>{
  return request.userName === req.user.userName
})){
await userSchema.findOneAndUpdate({userName : req.user.userName } , 
  { "$pull": { "requestsReceived": { "userName": req.body.userName } }}
  )
 await userSchema.findOneAndUpdate({userName : req.body.userName } , 
{ "$pull": { "requestsSent": { "userName": req.user.userName } }}
)

const newUserSender = await userSchema.findOneAndUpdate({
  userName: req.body.userName
}  , { $push: { rooms: {name : req.user.name , userName : req.user.userName , image : req.user.image } } } , 
{new : true  } 
)
const newUserReceiver = await userSchema.findOneAndUpdate({
  userName: req.user.userName
}  , { $push: { rooms: {name : req.body.name , userName : req.body.userName , image: req.body.image } } } , 
{new : true  }
)


if(newUserSender.rooms.some( room =>{
  return room.userName === req.user.userName
})&& newUserReceiver.rooms.some(room=>{
  return room.userName === req.body.userName
} ) ){
  await roomSchema.create({
    firstMember : req.body.userName , 
    secondMember: req.user.userName  , 
  })
  res.status(200).json({"type" :"success" , "data" : newUserReceiver })
}
else {
  res.status(400).json({"type" : "failed" , "error" : "it seems that there is some error in the database" })
}
}
else {
  res.status(400).json({"type" : "failed" , "error" : "it seems that the user didiin't send you a request or something went wrong in the server"})
}
})
const cancelFriend = AsyncWraper(async(req , res)=>{
 const newOtherUser = await userSchema.findOneAndUpdate({ userName: req.body.userName } , 
  { "$pull": { "rooms": { "userName": req.user.userName } }} ,
  {new : true } 
  )

  const newUserCanceler = await userSchema.findOneAndUpdate({ userName : req.user.userName } ,
     { "$pull": { "rooms": { "userName": req.body.userName } }} , 
     {new: true }
)
if(newUserCanceler.rooms.every( room =>{
return room.userName !== req.body.userName 
}) && newOtherUser.rooms.every(room =>{
  return room.userName !== req.user.userName
})){
res.status(200).json({"type": "success"  , "data" : newUserCanceler})
}
else res.status(400).json({"type" : "failed" , "error" : "it seem that there is an error in the database"})
})



const cancelRequest = AsyncWraper(async(req , res)=>{
  const newUserSender = await  userSchema.findOneAndUpdate({ userName : req.user.userName} ,
  { "$pull": { "requestsSent": { "userName": req.body.userName } }} ,
  {new : true}
    )
const newUserReceiver = await userSchema.findOneAndUpdate({userName : req.body.userName} , 
  { "$pull": { "requestsReceived": { "userName": req.user.userName} }} ,
  {new : true}
  )
if(newUserReceiver.requestsReceived.every(request =>{return request.userName !== req.user.userName}) && newUserSender.requestsSent.every(request =>{return request !== req.body.userName}) ){
  res.status(200).json({"type": "success" , "data" : newUserSender})
}
else res.status(400).json({"type" : "failed"  , "error" : "it seems that there is some errors in the database"}) 
})
const sendMessage = AsyncWraper (async (req , res)=>{
  const newRoom = await  roomSchema.findOneAndUpdate( { $or: [{ firstMember: req.user.userName , secondMember:  req.body.receiver }, { firstMember: req.body.receiver , secondMember: req.user.userName}] },
 { $push : {messages: { sender: req.user.userName , message: req.body.message , likes :  [ ] }} }
  )
res.status(200).json({"type" : "success"  , "data" : newRoom})
})
const getRoom = AsyncWraper(async(req, res )=>{
  console.log("i got the request");
  const room = await roomSchema.findOne({ $or: [{ firstMember: req.user.userName , secondMember:  req.params.userName }, { firstMember: req.params.userName , secondMember: req.user.userName}] })
  if(room) {
    res.status(200).json({"type" : "success"  , "data" : room })
  }
  res.status(404).json({"type" : "failed" , "error" : "sorry !! we coundn't find this room in the database"})
})
module.exports = {CreateMessage , DeleteMessage  , sendRequest , acceptRequest , cancelFriend , cancelRequest , sendMessage , getRoom }