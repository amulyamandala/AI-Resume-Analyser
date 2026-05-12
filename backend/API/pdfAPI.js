import exp from "express";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { verifyToken } from "../middleware/verifyToken.js";

export const pdfApp=exp.Router();

// GENERATE PDF
pdfApp.post("/generate",verifyToken,async(req,res)=>{
    try{
      const{improvedResume}=req.body;

      if(!improvedResume){
        return res.status(400).json({message:"improvedResume is required",});
      }

      // CREATE FILE NAME
      const fileName=`resume-${Date.now()}.pdf`;
      // CREATE PDF FOLDER
      const pdfDir=path.join(process.cwd(),"uploads","pdfs");
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir,{
          recursive:true,
        });
      }
      const filePath=path.join(pdfDir,fileName);
      // CREATE PDF
      const doc=new PDFDocument({
        margin: 40,
      });
      const stream=fs.createWriteStream(
        filePath
      );
      doc.pipe(stream);
      // TITLE
      doc.fontSize(20).text("Improved Resume",{
          align: "center",
        });
      doc.moveDown();
      // RESUME TEXT
      doc.fontSize(12).text(improvedResume,{
          align: "left",
        });
      doc.end();
      // WAIT FOR SAVE
      stream.on("finish",()=>{
        const downloadUrl = `/uploads/pdfs/${fileName}`;
        res.status(200).json({message:"PDF generated successfully",downloadUrl,});
      });
    } catch(err){
      console.log(err);
      res.status(500).json({message:"PDF generation failed",});
    }
  }
);
// GENERATE ROADMAP PDF
pdfApp.post("/generate-roadmap",verifyToken,async(req,res)=>{
  try{
    const{studyPlan}=req.body;
    if(!studyPlan){
      return res.status(400).json({message:"studyPlan is required",});
    }
    const fileName=`roadmap-${Date.now()}.pdf`;
    const pdfDir=path.join(process.cwd(), "uploads", "pdfs");
    if(!fs.existsSync(pdfDir)){
      fs.mkdirSync(pdfDir,{recursive:true});
    }
    const filePath=path.join(pdfDir, fileName);
    const doc=new PDFDocument({ margin: 40 });
    const stream=fs.createWriteStream(filePath);
    doc.pipe(stream);
    // TITLE
    doc.fontSize(24).text("Your Study Roadmap", {align:"center"});
    doc.moveDown();
    // WEAK AREAS
    if (studyPlan.weakTopics&&studyPlan.weakTopics.length>0){
      doc.fontSize(16).text("Areas to Improve:", { underline: true });
      doc.fontSize(12).text(studyPlan.weakTopics.join(", "));
      doc.moveDown();
    }
    // ROADMAP
    studyPlan.roadmap.forEach((week) => {
      doc.fontSize(16).fillColor("black").text(`Week ${week.week}: ${week.title}`, { underline: true });
      doc.moveDown(0.5);

      if (week.tasks && week.tasks.length > 0) {
        week.tasks.forEach((task, idx) => {
          doc.fontSize(12).fillColor("#333").text(`${idx + 1}. ${task}`, { indent: 20 });
        });
      }
      doc.moveDown();
    });
    doc.end();
    stream.on("finish",()=>{
      res.status(200).json({message: "Roadmap PDF generated successfully",downloadUrl: `/uploads/pdfs/${fileName}`,});
    });
  } catch(err){
    console.log(err);
    res.status(500).json({message:"Roadmap PDF generation failed",});
  }
});