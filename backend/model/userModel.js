import { Schema , model} from 'mongoose'
const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"Name required"]
    },
    email:{
        type:String,
        required:[true,"Email required"]
    },
    password:{
        type:String,
        required:[true,"Password required"]
    }
    },{
     timestamps:true,
     versionKey:false,
     strict:"throw"
})
export const UserModel=model("user",userSchema)