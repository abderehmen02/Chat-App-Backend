const AsyncWraper = (fn)=>{
    return (req , res , next)=>{
        try{ fn(req , res , next) }
        catch(error){
            console.log(error)
            res.status(400).json({"type" : "failed" , "error" : error })
        }
    }
}
module.exports = AsyncWraper