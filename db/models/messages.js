const mongoose = require("mongoose");
const messagesSchema = new mongoose.Schema( {
    sender: {id: {type : String , required: [true , "sender id is not defined"]}},
    receiver: {id: {type : String , required: [true , "sender id is not defined"]}},
    room : {type: String , required: [true , "the room message is not defiened "]} , 
    text: {type: String , required: [true, "you must provide a message"] } ,
})
module.exports = mongoose.model("MyMessages" , messagesSchema )