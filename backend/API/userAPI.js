import exp from 'express'
import { UserModel } from "../model/userModel.js";
import {hash,compare} from 'bcrypt';
import { verifyToken } from "../middleware/verifyToken.js";
import {config} from 'dotenv'
import jwt from 'jsonwebtoken'
const {sign,verify}=jwt
export const userApp=exp.Router()
//Registration route
userApp.post("/user",async(req,res)=>{
    try{
        const newUser=req.body
        newUser.password=await hash(newUser.password,12)
        const userDoc=new UserModel(newUser)
        await userDoc.save()
        //auto-login user after registration
        const token=sign({id:userDoc._id,email:userDoc.email},process.env.JWT_SECRET,{expiresIn:"2h"});
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false,
        })
        let userObj=userDoc.toObject()
        delete userObj.password
        res.status(201).json({message:"User has registered",payload:userObj})
    }
    catch(err){
        console.log("Registration error",err)
        res.status(500).json({message:"Registration failed",error:err.message})
    }
})
//login
userApp.post("/login",async(req,res)=>{
    const{email,password}=req.body
    let user=await UserModel.findOne({email})
    if(!user)
        return res.status(401).json({message:"Invalid email"})
    const isPasswordValid=await compare(password,user.password)
    if(!isPasswordValid)
        return res.status(401).json({message:"Invalid password"})
    const token=sign({id:user._id,email:user.email},process.env.JWT_SECRET,{expiresIn:"1h"})
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false,
    })
    let userObj=user.toObject()
    delete userObj.password
    res.status(200).json({message:"Login successful",token,payload:userObj})
})