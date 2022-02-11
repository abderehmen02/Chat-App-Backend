const message = require("../db/models/messages");
const roomModel = require("../db/models/room");
const userModel = require("../db/models/user")
const jwt = require("jsonwebtoken")
const CreateRoom =  async (req , res  , next)=>{
    console.log("user usere")
    console.log(req.user)
const room  = await roomModel.create(req.body);
const user = await userModel.findOneAndUpdate({userName: req.user.userName} , {rooms : [... req.user.rooms , room._id ]} )
res.status(201).json({"type" :"success" , room });
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
    if(req.user.rooms.includes(req.params.id)){
    const room = await roomModel.findById(req.params.id)
    res.status(201).json({"type" :"success" , data: messages } )}
else res.status(404).json({"type" : "failed" , "error" : "this room is not you room"})

    res.status(200).json({"type" : "success" , "data" : room})
}
module.exports  =  {GetRoomMessages , CreateRoom , DeletAllRoomMessages , GetRoomMembers }