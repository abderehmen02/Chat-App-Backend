const mongoose  =  require("mongoose")
const UserSchema = mongoose.Schema({
name: {type: String , required: [true  , ' name is not defiened'] } , 
passWord: {type:  String , required: [true  , 'password is not defiened'] } ,
userName : {type : String , require: [true , 'userName is not defiend'] , unique: [true , "this userName already exist "] }  ,
rooms : [{name : String , userName :String , image : String  }] ,
image: {type: String , required: false} , 
interests : [String] , 
allMessages : [Object] , 
requestsSent : { type: [{userName: String , name : String}] , unique: [true , "you already sent a request to that user"] } ,
requestsReceived : { type: [{userName: String , name : String , image : {type: String , require: false} }] , unique: [true , "you already received that request" ]} ,
image: {type: String , default : 'unknown.png'}
})
UserSchema.index({name: 'text'})
module.exports = mongoose.model("user" , UserSchema ) ; 