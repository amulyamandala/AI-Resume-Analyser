import { Schema,model,Types } from "mongoose";
const studyPlanSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },

    analysisId: {
      type: Types.ObjectId,
      ref: "analysis",
      required: true,
    },

    weakTopics: [String],

    generatedBy: {
      type: String,
      default: "groq_api_key",
    },

    roadmap: [
      {
        week: Number,

        title: String,

        tasks: [String],
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  }
);
export const StudyPlan = model("studyplan", studyPlanSchema);