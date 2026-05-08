import exp from "express";
import axios from "axios";

import { AnalysisModel } from "../model/analysisModel.js";
import {StudyPlanModel} from "../model/studyplanModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

const studyPlanApp = exp.Router();

studyPlanApp.post(
  "/generate/:analysisId",
  verifyToken(),
  async (req, res) => {
    try {
      const { analysisId } = req.params;

      // find analysis
      const analysis =
        await AnalysisModel.findById(
          analysisId
        );

      if (!analysis) {
        return res.status(404).json({
          message: "Analysis not found",
        });
      }

      // ownership check
      if (
        analysis.userId.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }

      // existing plan check
      const existingPlan =
        await StudyPlanModel.findOne({
          analysisId,
        });

      if (existingPlan) {
        return res.status(200).json({
          message:
            "Study plan already exists",
          payload: existingPlan,
        });
      }

      // weak topics
      const weakTopics =
        analysis.keywordsMissing || [];

      // AI Prompt
      const prompt = `
You are an AI career coach.

A user's resume analysis detected these weak areas:

Weak Topics:
${weakTopics.join(", ")}

ATS Score:
${analysis.atsScore}

Missing Keywords:
${analysis.keywordsMissing.join(", ")}

Generate:
1. A 4-week study roadmap
2. Weekly goals
3. Tasks per week
4. Mini projects
5. Skills to improve
6. Beginner-friendly progression

Return ONLY valid JSON in this format:

{
  "roadmap":[
    {
      "week":1,
      "title":"",
      "tasks":[]
    }
  ]
}
`;

      // GEMINI API CALL
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }
      );

      // AI response text
      const aiText =
  response?.data?.candidates?.[0]
    ?.content?.parts?.[0]?.text;
    if (!aiText) {
  return res.status(500).json({
    message: "No response from AI",
  });
}
      // remove markdown if exists
      const cleanedText = aiText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // convert AI response to object
    let parsedData;

try {
  parsedData = JSON.parse(cleanedText);
} catch (parseError) {
  return res.status(500).json({
    message: "AI returned invalid JSON",
  });
}

if (!parsedData.roadmap) {
  return res.status(500).json({
    message: "Invalid roadmap structure",
  });
}

      // save study plan
      const studyPlan =
        await StudyPlanModel.create({
          userId: req.user.id,
          analysisId,
          weakTopics,
          roadmap:
            parsedData.roadmap,
        });

      res.status(201).json({
        message:
          "Study plan generated successfully",
        payload: studyPlan,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Error generating study plan",
      });
    }
  }
);
studyPlanApp.get(
  "/:analysisId",
  verifyToken(),
  async (req, res) => {
    try {
      const { analysisId } = req.params;

      const studyPlan =
        await StudyPlanModel.findOne({
          analysisId,
        });

      if (!studyPlan) {
        return res.status(404).json({
          message: "Study plan not found",
        });
      }

      if (
        studyPlan.userId.toString() !==
        req.user.id
      ) {
        return res.status(403).json({
          message: "Unauthorized",
        });
      }

      res.status(200).json({
        payload: studyPlan,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Error fetching study plan",
      });
    }
  }
);

export { studyPlanApp };