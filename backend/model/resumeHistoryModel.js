import { Schema, model, Types } from "mongoose";

const resumeHistorySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },

    originalResumeUrl: {
      type: String,
    },

    improvedResumeUrl: {
      type: String,
    },

    originalResumeText: {
      type: String,
      required: true,
    },

    improvedResumeText: {
      type: String,
      required: true,
    },

    oldScore: {
      type: Number,
      required: true,
    },

    newScore: {
      type: Number,
      required: true,
    },

    missingKeywords: [String],
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);

export const ResumeHistoryModel=model("resumehistory",resumeHistorySchema);