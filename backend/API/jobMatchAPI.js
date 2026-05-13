import exp from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { ResumeModel } from "../model/resumeModel.js";
import { AnalysisModel } from "../model/analysisModel.js";
import PdfParse from "pdf-parse";
import mammoth from "mammoth";
import natural from "natural";
import { removeStopwords } from "stopword";
import { createRequire } from "module";
import { calculateAtsScore } from "../utils/scoringUtils.js";

const require=createRequire(import.meta.url);
const pdfParse=require("pdf-parse");

export const jobMatchApp=exp.Router();

// JOB MATCH API

jobMatchApp.post("/run/:resumeId",verifyToken,async(req,res)=>{
    try{
      const {resumeId}=req.params;
      const{jobDescription}=req.body;

      if(!jobDescription){
        return res.status(400).json({message: "Job description is required"});
      }

      // FIND RESUME
      const resume=await ResumeModel.findById(resumeId);
      if(!resume){
        return res.status(404).json({message:"Resume not found"});
      }
      if(resume.userId.toString()!==req.user.id){
        return res.status(403).json({message:"Unauthorized"});
      }

      // DOWNLOAD FILE

      const response=await fetch(resume.fileUrl);
      if(!response.ok){
        return res.status(400).json({message:"File download failed"});
      }
      const arrayBuffer=await response.arrayBuffer();
      const buffer=Buffer.from(arrayBuffer);
      let resumeText="";

      // EXTRACT TEXT

      try {
        if (resume.fileType==="application/pdf") {
          const parsed=await pdfParse(buffer);
          resumeText=parsed.text.toLowerCase();
        } else if (resume.fileType==="application/vnd.openxmlformats-officedocument.wordprocessingml.document" || resume.fileType==="application/msword" || resume.fileName.toLowerCase().endsWith('.docx') || resume.fileName.toLowerCase().endsWith('.doc')) 
          {
          const result=await mammoth.extractRawText({
            buffer,
          });
          resumeText=result.value.toLowerCase();
        } else {
          return res.status(400).json({message:"Unsupported file type. Supported formats: PDF, DOCX, DOC"});
        }
      } catch(extractErr) {
        console.log("Text extraction error:", extractErr.message);
        return res.status(400).json({message:"Failed to extract text from file. Please ensure the file is valid."});
      }

      // TECH KEYWORDS
      // UNIFIED SCORING
      const {score: matchScore, matched: matchedKeywords, missing: missingKeywords}=calculateAtsScore(resumeText, jobDescription);

      // ADDITIONAL METRICS (Formatting & Readability)
      const section={
        education: resumeText.includes("education"),
        skills: resumeText.includes("skills"),
        experience: resumeText.includes("experience"),
        certifications: resumeText.includes("certifications"),
        projects: resumeText.includes("projects"),
      };

      const formatScore=resumeText.length>1000?80:60;
      const readabilityScore=resumeText.split(" ").length>300?85:65;

      // SUGGESTIONS

      const suggestions=[];
      if (missingKeywords.length>0){
        suggestions.push(`Add these missing skills: ${missingKeywords.join(", ")}`);
      }
      if (!section.projects) {
        suggestions.push("Add a dedicated projects section");
      }

      if (!section.experience) {
        suggestions.push("Add detailed work experience");
      }

      if (matchScore < 50) {
        suggestions.push("Your resume is weakly aligned with this job description.");
      } else if (matchScore < 80) {
        suggestions.push("Your resume partially matches the job description.");
      } else{
        suggestions.push("Your resume is strongly aligned with the job description.");
      }

      // SAVE TO DATABASE
      const analysis=await AnalysisModel.create({
        userId:req.user.id,
        resumeId:resumeId,
        atsScore:matchScore,
        keywordsMatched:matchedKeywords,
        keywordsMissing:missingKeywords,
        suggestions:suggestions,
        section,
        formatScore,
        readabilityScore,
      });

      // RESPONSE
      res.status(200).json({message:"Job match analysis completed",version:"v2",analysisId:analysis._id,analysis,matchScore,resumeText,matchedKeywords,missingKeywords,suggestions,});
    } catch(err){
      console.log(err);
      res.status(500).json({message: "Job match analysis failed",});
    }
  }
);