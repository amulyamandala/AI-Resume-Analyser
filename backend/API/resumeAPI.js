import exp from "express"
import {ResumeModel} from '../model/resumeModel.js'
import { UserModel } from "../model/userModel.js"
import {uploadToCloudinary} from "../config/cloudinaryUpload.js"
import {upload} from "../config/multer.js"
import { verifyToken } from "../middleware/verifyToken.js"
import {config} from 'dotenv'
export const resumeApp=exp.Router()
//upload file route
resumeApp.post("/upload",verifyToken,upload.single("resume"),async(req,res)=>{
    try{
    if(!req.file){
        return res.status(400).json({message:"No file uploaded"})
    }
    const result= await uploadToCloudinary(req.file.buffer)
    const newResume=new ResumeModel({
      userId:req.user.id,
      fileUrl:result.secure_url,
      fileName:req.file.originalname,
      fileType:req.file.mimetype
});
      await newResume.save()
      res.status(201).json({message:"Resume uploaded",resume:newResume})
    }
     catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
})
//display the users resume in the page 
resumeApp.get("/resume/:id",verifyToken,async(req,res)=>{
    try{
        const resume=await ResumeModel.findById(req.params.id)
        if(!resume){
            return res.status(404).json({ message: "Resume not found" });
    }
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    res.status(200).json({message:"Resume found",payload:resume})
  } catch (err) {
    res.status(500).json({ message: "Error displaying resume" });
  }
});
// GET ALL USER RESUMES
resumeApp.get("/my-resumes",verifyToken,async(req,res)=>{
    try{
      const resumes=await ResumeModel.find({userId:req.user.id}).sort({createdAt:-1});
      res.status(200).json({message:"User resumes fetched",payload:resumes});
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:"Error fetching resumes"});
    }

});
//delete the resume
resumeApp.delete("/:id",verifyToken,async(req,res)=>{
    try {
    const resume = await ResumeModel.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    if (resume.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await ResumeModel.findByIdAndDelete(req.params.id)
    res.status(200).json({message:"resume deleted"})
}
catch(err){
res.status(500).json({ message: "Error deleting resume" });
}});

