const message = require("../db/models/messages");
const roomModel = require("../db/models/room");
const userModel = require("../db/models/user")

const CreateRoom =  async (req , res  , next)=>{
    const room = roomModel.create({creator: req.user.userName}) ; 
    const updatedUser = userModel.findOneAndUpdate({userName: req.user.userName} , {rooms: [...res.user.rooms , room_id ] } )
    res.json(updatedUser)
}

const GetRoomMessages  = async(req , res , next)=>{

    if(req.user.rooms.includes(req.params.roomId)){
    const messages = await message.find({room : req.params.roomId})
    res.status(201).json({"type" :"success" , data: messages } )}
    else res.status(404).json({"type" : "failed" , "error" : "this room is not you room"})
}

const DeletAllRoomMessages = async (req , res , next)=>{
if(req.user.rooms.includes(req.params.room)){
    const messages = await message.findOneAndDelete({room : req.params.room})
    res.status(201).json({"type" :"success" , data: messages } )}
else res.status(404).json({"type" : "failed" , "error" : "this room is not you room"})
}

const GetRoomMembers = async (req , res , next)=>{
    if(req.user.rooms.includes(req.params.room)){
   const roomsMembers  =  await user.find({rooms: req.params.room })  
   const receiver = roomsMembers.filter(item =>{ return item.userName !== req.user.userName })

    res.status(201).json({"type" :"success" , data: messages } )}
else res.status(404).json({"type" : "failed" , "error" : "this room is not you room"})

    res.status(200).json({"type" : "success" , "data" : { "room" : room , "receiver" : receiver }})
}

const getUserRooms = async (req , res , next)=>{

    const user = await userModel.findOne({userName: req.user.userName })
    res.status(200).json({"type" : "success" , "data" : user.rooms  })

}
module.exports  =  {GetRoomMessages , CreateRoom , DeletAllRoomMessages , GetRoomMembers , getUserRooms }