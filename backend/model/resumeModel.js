import { Schema,model,Types } from "mongoose";
const resumeSchema=new Schema({
    userId:{
      type:Types.ObjectId,
      ref:"user",
      required:[true,"UserID required"]
    },
    fileUrl:{
        type:String,
        required:[true]
    },
    fileName:{
        type:String,
        required:[true]
    },
    fileType:{
        type:String,
        enum:["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","image/jpeg","image/png"],
        required:[true,"File type required"]
    },
    extractText:{
        type:String,
    }
},{
    versionKey:false,
    timestamps:true,
    strict:"throw",
})
export const ResumeModel=model("resume",resumeSchema)