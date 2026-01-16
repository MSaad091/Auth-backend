
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

const userSchema = mongoose.Schema({
username:{
    type:String,
    required:true,
    unique:true
},
email:{
     type:String,
    required:true,
    unique:true
},
password:{
     type:String,
    required:true,
    unique:true
},
avatar:{
     type:String,
    required:true,
    
},
address:{
     type:String,
    required:true,
    unique:true
}
},{timestamps:true})

userSchema.methods.generateToken =  function() {
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET
    )
}

export const User = mongoose.model("User",userSchema)




