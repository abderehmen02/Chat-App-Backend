const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
firstMember : String , 
secondMember : String , 
messages :{type  :  [{sender: String , message: String , likes : [{userName : String }] }] , required: false }
})
module.exports = mongoose.model("room"  , roomSchema  )