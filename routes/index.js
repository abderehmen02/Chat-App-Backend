const express = require('express')  ; 
const MyRouter = express.Router()    ;
const {CreateMessage  } = require("../controlers/MessageControlers")
const {CreateUser , UpdateUser , DeleteUser, Login } = require("../controlers/userControlers")
const { CreateRoom , DeletAllRoomMessages  , GetRoomMessages, GetRoomMembers } = require("../controlers/roomControlers")
const {AutorizeUser}  = require("../controlers/userControlers")
MyRouter.post("/messages" ,CreateMessage)





// the user router

MyRouter.post("/user/SignUp" , CreateUser )
MyRouter.post("/user/SignIn" , Login )
MyRouter.delete("/user/:userName" , AutorizeUser , DeleteUser ) 
MyRouter.patch('/user/:userName' , AutorizeUser , UpdateUser )

// the room router

MyRouter.get("/room/:id" , AutorizeUser  ,   GetRoomMembers  )
MyRouter.post('/room' , AutorizeUser , CreateRoom )
MyRouter.delete("/room/:id"  , AutorizeUser , DeletAllRoomMessages)
module.exports = MyRouter