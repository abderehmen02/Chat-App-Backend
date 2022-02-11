const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema({
    members :{ type:  [ String ] , unique: [true , "room is already created"]  }
})
module.exports = mongoose.model("room"  , roomSchema  )