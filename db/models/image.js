const mongoose = require('mongoose') ;

const ImageSchema = new mongoose.Schema({
    userName : {type: String , required  :[true , 'username is not defiened']} , 
    image: {
        data: Buffer ,
        contentType: String 
    }
})
module.exports  = mongoose.model('image' , ImageSchema)