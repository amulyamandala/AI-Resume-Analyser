import exp from "express"
import { AnalysisModel } from "../model/analysisModel.js"
import { UserModel } from "../model/userModel.js"
import { config } from "dotenv"
import mammoth from "mammoth";
import { verifyToken } from "../middleware/verifyToken.js"
import { resumeApp } from "./resumeAPI.js"
import { ResumeModel } from "../model/resumeModel.js"
export const analysisApp=exp.Router()
import { createRequire } from "module";
import PdfParse from "pdf-parse"
const require=createRequire(import.meta.url);
const pdfParse=require("pdf-parse");
//analyze the resume
analysisApp.post("/run/:resumeId",verifyToken,async(req,res)=>{
     try{
        const {resumeId}=req.params
        const resume=await ResumeModel.findById(resumeId)
        if(!resume){
            return res.status(404).json({message:"Resume not found"})
        }
        if(resume.userId.toString()!==req.user.id){
            return res.status(403).json({message:"Unauthorized"})
        }
        const response=await fetch(resume.fileUrl)
        if(!response.ok){
           return res.status(400).json({message:"File failed download"})
        }
        const arrayBuffer=await response.arrayBuffer();
        const buffer=Buffer.from(arrayBuffer)
        let text="";
        if(resume.fileType==="application/pdf"){
          const parsed=await pdfParse(buffer);
          text=parsed.text.toLowerCase();
      }
      else if(resume.fileType==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        const result=await mammoth.extractRawText({buffer});
        text=result.value.toLowerCase();
     }
      else{
        return res.status(400).json({message:"Unsupported file type"});
      }

        const keywords=["javascript","node","web development","python","data structures","machine learning","react","mongodb","java","c","agentic ai","soft skills","communication"]
        const keywordsMatched=keywords.filter(k=>text.includes(k));
        const keywordsMissing=keywords.filter(k=>!text.includes(k));
        const atsScore=Math.round((keywordsMatched.length/keywords.length)*100)
        const section={
        education:text.includes("education"),
        skills:text.includes("skills"),
        experience:text.includes("experience"),
        certifications:text.includes("certifications"),
        projects:text.includes("projects")};
        const formatScore=text.length>1000?80:60
        const readabilityScore=text.split(" ").length>300?85:65
        const suggestions=[]
        if(keywordsMissing.length>0){
            suggestions.push("Add missing skills "+ keywordsMissing.join(","))
        }
        if(!section.projects){
            suggestions.push("Add projects")
        }
        if (!section.experience) {
            suggestions.push("Add experience details")
        }
        const analysis=new AnalysisModel({
        userId:req.user.id,
        resumeId,
        atsScore,
        keywordsMatched,
        keywordsMissing,
        suggestions,
        section,
        formatScore,
        readabilityScore})
        await analysis.save()
        res.status(201).json({message:"Analysis completed successfully",analysis,resumeText:text})
     }
        catch(err){
        console.log(err);
        res.status(500).json({message:"Analysis failed"});
  }
})
//history
analysisApp.get("/history/:resumeId",verifyToken,async(req,res)=>{
  try{
    const resume=await ResumeModel.findById(req.params.resumeId);
    if(!resume||resume.userId.toString()!==req.user.id){
      return res.status(403).json({message:"Unauthorized"});
    }
    const history=await AnalysisModel.find({resumeId:req.params.resumeId}).sort({createdAt:-1});
    res.status(200).json({message:"Analysis history",history});
  } catch(err){
    res.status(500).json({message:"Error fetching history"});
  }
});
//get analysis results 
analysisApp.get("/:resumeId",verifyToken,async(req,res)=>{
  const resume=await ResumeModel.findById(req.params.resumeId);
  if(!resume||resume.userId.toString()!==req.user.id){
    return res.status(403).json({message:"Unauthorized"});
  }
  const analysis=await AnalysisModel.findOne({resumeId:req.params.resumeId}).sort({createdAt:-1});
  if(!analysis){
    return res.status(404).json({message:"Analysis not found"});
  }
  res.status(200).json({message:"Analysis fetched",analysis});
});
  //delete analysis
  analysisApp.delete("/:id",verifyToken,async(req,res)=>{
  try{
    const analysis=await AnalysisModel.findById(req.params.id);
    if(!analysis){
      return res.status(404).json({message:"Analysis not found"});
    }
    const resume=await ResumeModel.findById(analysis.resumeId);
    if(!resume||resume.userId.toString()!==req.user.id){
      return res.status(403).json({message:"Unauthorized"});
    }
    await AnalysisModel.findByIdAndDelete(req.params.id);
    res.status(200).json({message:"Analysis deleted"});
  }
  catch(err){
    res.status(500).json({message:"Error deleting analysis"});
  }
})
