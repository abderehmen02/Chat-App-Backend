const express = require('express')  ; 
const MyRouter = express.Router()    ;
const { getRoom , acceptRequest, sendMessage,  DeleteMessage, sendRequest, cancelFriend, cancelRequest  } = require("../controlers/MessageControlers")
const {CreateUser  , upload , uploadProfileImage ,  FindOneUser , FindUserWithInterests , UpdateUser , DeleteUser, Login , FindUsers , updateProfile , uploadMiddleWare} = require("../controlers/userControlers")
const { CreateRoom , getUserRooms ,  DeletAllRoomMessages  , GetRoomMessages, GetRoomMembers } = require("../controlers/roomControlers")
const {AutorizeUser }  = require("../controlers/userControlers");
//message router

MyRouter.post("/messages" , AutorizeUser ,  sendMessage)
MyRouter.delete('/messages/:id' , AutorizeUser , DeleteMessage )

// the user router

MyRouter.post("/user/SignUp" , CreateUser )
MyRouter.post("/user/SignIn" , Login )
//edditing profile  api
MyRouter.patch('/user/update' , AutorizeUser  ,  updateProfile)
MyRouter.patch('/user/profileImage' , AutorizeUser , uploadMiddleWare() , uploadProfileImage)
MyRouter.delete("/user/delete/:userName" , AutorizeUser , DeleteUser ) 
MyRouter.patch('/user/update/:userName' , AutorizeUser , UpdateUser )
MyRouter.get('/user/Search/:userName' , FindUsers )
MyRouter.get("/user/interests" , FindUserWithInterests )
MyRouter.get("/user/findOneUser/:userName" , FindOneUser )

//messages
MyRouter.post('/messages/sendRequest' , AutorizeUser , sendRequest )
MyRouter.post('/messages/acceptRequest' , AutorizeUser , acceptRequest )
MyRouter.post('/messages/cancelFriend' , AutorizeUser , cancelFriend )
MyRouter.post('/messages/cancelRequest', AutorizeUser , cancelRequest )
MyRouter.post('/messages/sendMessage' , AutorizeUser , sendMessage )
MyRouter.get('/messages/:userName' , AutorizeUser , getRoom)
// MyRouter.post('/messages/sendMessage' , AutorizeUser , sendMessage )
// the room 
MyRouter.get("/room" , AutorizeUser , getUserRooms )
MyRouter.get("/room/:id" , AutorizeUser  ,   GetRoomMembers  )
MyRouter.post('/room' , AutorizeUser , CreateRoom )
MyRouter.delete("/room/:id"  , AutorizeUser , DeletAllRoomMessages)


module.exports = MyRouter