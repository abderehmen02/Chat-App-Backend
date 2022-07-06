const mongoose = require("mongoose");
const messagesSchema = new mongoose.Schema( {
    sender: {type: String , required: [true , " you must provide a sender"]} ,
    receiver: {type: String , required: [true , "you must provide a receiver"]},
    visibles : {type: Array ,} ,  
    room : {type: String , required: [true , "the room message is not defiened "]} , 
    text: {type: String , required: [true, "you must provide a message"] } ,
})
module.exports = mongoose.model("MyMessages" , messagesSchema )