const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const {Db}=require("mongodb")
const port = process.env.PORT || 4000

const app = express()
app.use((express.json()))
app.use(cors())
app.use(express.urlencoded())

const connect = ()=>{
    mongoose.connect("mongodb+srv://aakash:aakash@atlascluster.q8kqjn0.mongodb.net/?retryWrites=true&w=majority")
}


const UserSchema = new mongoose.Schema({
      name:{type:String,required:true},
      email:{type:String,required:true},
      password:{type:String,required:true}
})


const User = new mongoose.model("User",UserSchema)


app.post('/register',async(req,res)=>{
    try {
        const {name , password , email} = req.body
    User.findOne({email:email},(err , user)=>{
        if(user){
            res.send({message:"User Already registerd"})
        }else{
            const user = User.create(req.body)
            return res.status(200).send({message:"Sucessfully Registered"})
        }
    })
    } catch (error) {
        return res.status(401).send(error)
    }
    
})

app.post("/login",async(req,res)=>{
    try {
        const {email , password} = req.body
        User.findOne({email:email},(err,user)=>{
            if(user){
                if(password === user.password){
                    res.status(201).send({message:"Login Successfull" , user:user})
                }else{
                    res.send({message:"Password doesn't match"})
                }
            }else{
                res.send({message:"User not found"})
            }
        })
    } catch (error) {
        return res.status(401).send(error)
    }
})

app.get('/users',async(req,res)=>{
    try {
        const user = await User.find({}).lean().exec()
        return res.status(201).send({user:user})
    } catch (error) {
        res.status(401).send({error:error.message})
    }
})

app.listen(port , async()=>{
    try {
        await connect()
        
    } catch (error) {
        console.error(error)
    }
    console.log(`This is port ${port}`)
})