import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userApp } from './API/userAPI.js'
config()
 const app=exp()
 app.use(exp.json())
 app.use("/user-api",userApp)
 const port=process.env.PORT||5000
 const connectionDb=async()=>{
    try{
        await connect(process.env.DB_URL);
        console.log("connected ");
        app.listen(port,()=>console.log(`server is started on ${port}`))
    }catch(err){
        console.log(err)
    }
 }
 connectionDb()