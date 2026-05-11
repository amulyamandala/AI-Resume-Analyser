import exp from "express";

import { verifyToken } from "../middleware/verifyToken.js";

import { ResumeHistoryModel } from "../model/resumeHistoryModel.js";

export const resumeHistoryApp=exp.Router();

// GET USER HISTORY

resumeHistoryApp.get("/",verifyToken,async(req,res)=>{
  try {
      const history = await ResumeHistoryModel.find({userId: req.user.id,}).sort({createdAt:-1,});
      res.status(200).json({message: "Resume history fetched",history,});
    } catch (err) {
      console.log(err);
      res.status(500).json({message: "Error fetching history",});
    }
  }
);

// GET USER HISTORY

resumeHistoryApp.get("/",verifyToken,async(req,res)=>{
    try {
      const history =await ResumeHistoryModel.find({userId: req.user.id,}).sort({createdAt:-1,});
      res.status(200).json({message:"Resume history fetched",history,});
    } catch (err) {
      console.log(err);
      res.status(500).json({message:"Error fetching history",});
    }
  }
);