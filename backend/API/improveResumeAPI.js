import exp from "express";
import axios from "axios";
import { verifyToken } from "../middleware/verifyToken.js";
import { ResumeHistoryModel } from "../model/resumeHistoryModel.js";

export const improveResumeApp = exp.Router();

// IMPROVE RESUME API

improveResumeApp.post("/generate",verifyToken,async(req,res)=>{
    try{
      const {resumeText,jobDescription,missingKeywords}=req.body;
// VALIDATION
if(!resumeText){
        return res.status(400).json({message:"resumeText is required"});
      }
if(!jobDescription){
        return res.status(400).json({message:"jobDescription is required"});
      }
if(!missingKeywords||!Array.isArray(missingKeywords)){
        return res.status(400).json({message:"missingKeywords array is required"});
      }
// GROQ API KEY CHECK
if(!process.env.GROQ_API_KEY){
        return res.status(500).json({message:"GROQ_API_KEY is not configured"});
      }

      // AI PROMPT

      const prompt = `
You are an expert ATS resume optimization assistant.

Rewrite and improve the following resume based on the job description.

Rules:
- Improve wording and professionalism
- Make bullet points stronger and ATS friendly
- Naturally incorporate relevant missing keywords
- DO NOT add fake experience
- DO NOT invent projects or skills
- Keep the resume realistic
- Maintain proper formatting

Missing Keywords:
${missingKeywords.join(", ")}

Job Description:
${jobDescription}

Resume:
${resumeText}

Return ONLY the improved resume text.
`;

// GROQ API CALL
let response;
try{
 response = await axios.post("https://api.groq.com/openai/v1/chat/completions",{
            model:"llama-3.3-70b-versatile",
            messages: [{role: "user",content: prompt,}],
            temperature: 0.7,
            max_tokens: 3000,
          },
          {
            headers: {Authorization: `Bearer ${process.env.GROQ_API_KEY}`,

              "Content-Type":"application/json",
            },
          }
        );
      } catch (apiErr) {
        console.log("GROQ API Error:",apiErr.response?.data||apiErr.message);
        return res.status(500).json({message:"GROQ API Error: " +(apiErr.response?.data?.error?.message||apiErr.message),});
      }

      // AI RESPONSE
      const improvedResume =response?.data?.choices?.[0]?.message
          ?.content;
          // ATS SCORING LOGIC
const keywords = ["javascript","typescript","react","next.js","node.js","express","mongodb","mysql",
  "postgresql","redis","docker","kubernetes","aws","firebase","git","github",
  "rest api","graphql","jwt","tailwind css","machine learning","data structures",
  "algorithms","python","java","c++","c","html","css","problem solving","communication",
];
// EXTRACT JD KEYWORDS
const tokenizer=new axios.default.create().tokenizer||{tokenize:(t)=>t.toLowerCase().split(/\W+/) }; // Fallback tokenizer
const jdKeywords=keywords.filter((skill)=>jobDescription.toLowerCase().includes(skill.toLowerCase()));
// ORIGINAL SCORE (Based on JD)
const originalMatched=jdKeywords.filter((skill)=>resumeText.toLowerCase().includes(skill.toLowerCase()));

const oldScore=jdKeywords.length>0?Math.round((originalMatched.length/jdKeywords.length)*100):0;

// IMPROVED SCORE (Based on JD)
const improvedMatched=jdKeywords.filter((skill)=>
  improvedResume.toLowerCase().includes(skill.toLowerCase())
);

const newScore=jdKeywords.length>0?Math.round((improvedMatched.length/jdKeywords.length)*100):0;

      if(!improvedResume){
        return res.status(500).json({message:"No response from AI"});
      }

const history=await ResumeHistoryModel.create({
  userId:req.user.id,
  originalResumeUrl:req.body.originalResumeUrl,
  improvedResumeUrl:req.body.improvedResumeUrl,
  originalResumeText:resumeText,
  improvedResumeText:improvedResume,
  oldScore:oldScore,
  newScore:newScore,
  missingKeywords,
});
      // FINAL RESPONSE
      res.status(200).json({message:"Resume improved successfully",oldScore:oldScore,newScore:newScore,scoreImprovement:newScore-oldScore,improvedResume,history});
    } catch (err) {
      console.log("MAIN ERROR - improve resume:", {message: err.message,stack: err.stack,name: err.name,});

      res.status(500).json({message:"Error improving resume: " + err.message});
    }
  }
);