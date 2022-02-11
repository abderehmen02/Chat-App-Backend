const AsyncWraper = require("./asyncWraper")
const messagesSchema = require("../db/models/messages")

const CreateMessage = AsyncWraper( async (req , res , next)=>{
  await   messagesSchema.create(req.body)
    res.status(201).json({"status" : "success"}) }
)
const DeleteMessage = AsyncWraper(async (req , res , next)=>{
 await messagesSchema.findOneAndDelete({_id : req.params.id })
} )
module.exports = {CreateMessage, DeleteMessage}