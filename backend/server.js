import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userApp } from './API/userAPI.js'
import { resumeApp } from './API/resumeAPI.js'
import { analysisApp } from './API/analysisAPI.js'
import { studyPlanApp } from './API/studyplanAPI.js'
import { improveResumeApp } from './API/improveResumeAPI.js'
import { pdfApp } from "./API/pdfAPI.js";
import { resumeHistoryApp } from './API/resumeHistoryAPI.js'
import { jobMatchApp } from "./API/jobMatchAPI.js";
import cookieParser from "cookie-parser"
import cors from 'cors'


config()
 const app=exp()
  //cors configuration this allows the backend and frontend to interact 
 app.use(cors({
    origin:["http://localhost:5173","https://ai-resume-analyser-jade.vercel.app"],
    credentials:true
}))
 app.use(exp.json())
 app.use(cookieParser())
 app.use("/uploads", exp.static("uploads"));

 app.use("/user-api",userApp)
 app.use("/resume-api",resumeApp)
 app.use("/analysis-api",analysisApp)
app.use("/studyplan-api",studyPlanApp)
app.use("/job-match-api", jobMatchApp);
app.use("/pdf-api", pdfApp);
app.use("/resume-history-api",resumeHistoryApp)
app.use("/improve-resume-api",improveResumeApp)
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
 app.use((req,res,next)=>{
    console.log(req.url);
    res.status(404).json({message:"invald path"})
})

//error handling
app.use((err,req,res,next)=>{
    //res.json({message:"error has occured",error:err.message}) this is very basic 
    console.log(err.name)
    console.log(err.message)
    
    //validation error
    if(err.name==='ValidationError'){
        return res.status(400).json({messsage:"the validations is failed "})
    }
     //casterror
      if(err.name==='CastError'){
        return res.status(400).json({messsage:"the validations is failed "})
    }
    //send server side errors
    res.status(500).json({message:"this is from server side"})
})
