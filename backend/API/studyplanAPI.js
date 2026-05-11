import exp from "express";
import axios from "axios";
import {AnalysisModel} from "../model/analysisModel.js";
import {StudyPlan} from "../model/studyplanModel.js";
import {verifyToken} from "../middleware/verifyToken.js";
export const studyPlanApp = exp.Router();
studyPlanApp.post("/generate/:analysisId",verifyToken,async(req,res)=>{
    try {
      const {analysisId}=req.params;
      // find analysis
      const analysis=await AnalysisModel.findById(analysisId);
      if(!analysis){
        return res.status(404).json({message:"Analysis not found"});
      }
      // ownership check
      if(analysis.userId.toString()!==req.user.id) {
        return res.status(403).json({message: "Unauthorized"});
      }
      // existing plan check
      const existingPlan=await StudyPlan.findOne({analysisId});
      if(existingPlan){
        return res.status(200).json({message:"Study plan already exists",payload: existingPlan});
      }
      // weak topics
      const weakTopics=analysis.keywordsMissing||[];

      // AI Prompt
      const prompt = `You are an AI career coach.
      A user's resume analysis detected these weak areas:
      Weak Topics:${weakTopics.join(", ")}
      ATS Score:${analysis.atsScore}
      Missing Keywords:${analysis.keywordsMissing.join(", ")}
      Generate:
      1. A 4-week study roadmap
      2. Weekly goals
      3. Tasks per week
      4. Mini projects
      5. Skills to improve
      6. Beginner-friendly progression
      Return ONLY valid JSON in this format:
      {
         "roadmap":[{
          "week":1,
          "title":"",
          "tasks":[]
        }]
      }`
      // GROQ API CALL
      if(!process.env.GROQ_API_KEY){
        return res.status(500).json({message:"GROQ_API_KEY is not configured"});
      }
      let response;
      try{
        response=await axios.post(`https://api.groq.com/openai/v1/chat/completions`,
          {
           model: "llama-3.3-70b-versatile",
           messages: [{role:"user",content:prompt}],
           temperature: 0.7,
           max_tokens: 2000,
           response_format: {type:"json_object"}
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json"
            }
          });
      }catch(apiErr){
        console.log("GROQ API Error:", apiErr.response?.data || apiErr.message);
        return res.status(500).json({message:"GROQ API Error: " + (apiErr.response?.data?.error?.message || apiErr.message)});
      }

      // AI response text
      const aiText=response?.data?.choices?.[0]?.message?.content;
      if(!aiText){ 
        console.log("AI Response:", JSON.stringify(response.data));
        return res.status(500).json({message:"No response from AI"});
      }
      // remove markdown if exists
      const cleanedText=aiText.replace(/```json/g, "")
                              .replace(/```/g, "")
                              .trim();

      // convert AI response to object
      let parsedData
      try {
        parsedData=JSON.parse(cleanedText);
       } 
      catch(parseError){
        return res.status(500).json({message:"AI returned invalid JSON"});
       }
      if(!parsedData.roadmap){
        return res.status(500).json({message:"Invalid roadmap structure"});
      }
      
      // Filter roadmap to only include expected schema fields
      const cleanedRoadmap = parsedData.roadmap.map((week, index) => ({
       week:
        typeof week.week === "number"
          ? week.week
          : index + 1,

       title:
        typeof week.title === "string"
      ? week.title
      : "Untitled Week",

       tasks:
    Array.isArray(week.tasks)
      ? week.tasks.filter(task => typeof task === "string")
      : []}));
      
      // save study plan
      const studyPlan=await StudyPlan.create({userId: req.user.id,analysisId,weakTopics,roadmap:cleanedRoadmap});
      res.status(201).json({message:"Study plan generated successfully",payload:studyPlan});
    } 
    catch(err){
      console.log("MAIN ERROR - studyplan generate:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      res.status(500).json({message:"Error generating study plan: " + err.message});
    }
  }
);
studyPlanApp.get("/:analysisId",verifyToken,async(req,res)=>{
    try {
      const {analysisId}=req.params;
      const studyPlan=await StudyPlan.findOne({analysisId});
      if(!studyPlan){
        return res.status(404).json({message:"Study plan not found"});
      }
      if (studyPlan.userId.toString()!==req.user.id) {
        return res.status(403).json({message:"Unauthorized"});
      }
      res.status(200).json({payload: studyPlan});
    } 
    catch(err){
      console.log("MAIN ERROR - studyplan fetch:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      res.status(500).json({message:"Error fetching study plan: " + err.message});
    }
  }
);
