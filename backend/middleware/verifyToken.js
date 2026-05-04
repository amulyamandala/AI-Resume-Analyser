import jwt from 'jsonwebtoken'
import {config} from 'dotenv'

const{verify}=jwt
export const verifyToken=(...allowedRoles)=>{
return (req,res,next)=>{
     try{
    // token verification logic 
    //console.log(req.cookies)
    const token=req.cookies?.token
    // if unauthorozed user req
    if(!token){
        return res.status(401).json({message:"please login"})
    }
   
    //is token verified or not 
    const decodedToken=verify(token,process.env.JWT_SECRET)
   if(!allowedRoles.includes(decodedToken.role)){
    return res.status(403).json({message:"you are not authorized from middleware"})
   }
    //add decoded token 
    req.user=decodedToken
    next()
    }
    catch(err){
        res.status(401).json({message:"session expired.please relogin"})
    }

}}