const AsyncWraper = (fn)=>{
    return (req , res , next)=>{
        try{ fn(req , res , next) }
        catch(error){
            console.log(error)
        }
    }
}
module.exports = AsyncWraper