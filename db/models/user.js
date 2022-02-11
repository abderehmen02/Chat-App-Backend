const mongoose  =  require("mongoose")
const UserSchema = mongoose.Schema({
name: {type: String , required: [true  , ' name is not defiened'] } , 
passWord: {type:  String , required: [true  , ' password is not defiened'] } ,
userName : {type : String , require: [true , 'userName is not defiend'] , unique: [true , "this userName already exist"] }  ,
rooms : {type: [String]  , require: [true , 'must include a rooms array ']} ,
image: {type: String , required: false} 
})
module.exports = mongoose.model("user" , UserSchema ) ; 