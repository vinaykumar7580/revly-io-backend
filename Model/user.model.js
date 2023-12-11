const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name: String,
    email: String,
    password:String,
    role: String,
    classgrade:String,
    language:String,
    subject: [String],

},{
    versionKey:false
})

const User=mongoose.model("User", userSchema)

module.exports={User}