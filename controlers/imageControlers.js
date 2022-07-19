const multer = require("multer") ;
const ImageModel = require('../db/models/image')  ;


const Storage = multer.diskStorage({
    destination: (req , file , cd)=>{
        cd( null,  './uploads')
    } ,
    filename: (req , file ,cb)=>{
        cb(new Error("file not stored") ,'myImg' )
    }
})

const upload = multer({ dest: "uploads/" });
const uploadMiddleWare = ()=>{
    return upload.single('image')
}

const UploadImage = (req , res )=>{

    const newImage = new ImageModel({
        name : req.body.name , 
        image: {
            data: req.file.filename ,
            contentType: 'image/png'
        }
    })
    newImage.save().then(()=>{
       res.send("uploaded") 
    })

res.type(200).json({data  :'sent'})
}

module.exports = {UploadImage , uploadMiddleWare }