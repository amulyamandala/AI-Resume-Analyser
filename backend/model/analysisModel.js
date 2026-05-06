import { Schema,model,Types } from "mongoose";
const analysisSchema=new Schema({
    userId:{
        type:Types.ObjectId,
        ref:"user",
        required:true
    },
    resumeId:{
        type:Types.ObjectId,
        ref:"resume",
        required:true
    },
    atsScore:{
        type:Number
    },
    keywordsMatched:[String],
    keywordsMissing:[String],
    suggestions:[String],
    section:{
        education:Boolean,
        skills:Boolean,
        experience:Boolean,
        certifications:Boolean,
        projects:Boolean
    },
    formatScore:{
        type:Number
    },
    readabilityScore:{
        type:Number
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw",
})
export const AnalysisModel=model("analysis",analysisSchema)