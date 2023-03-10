const express=require('express')
const mongoose=require('mongoose')
const bodyparser=require('body-parser')
const connectDB=require('./connectDB')
const User=require('./model')
require('dotenv');
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
const cors=require('cors');



const app=express();
app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cors());

mongoose.set("strictQuery", false);
connectDB();

app.get('/',(req,res)=>{
    res.send("hello workd");
})
app.post('/signup',async(req,res) =>{
    console.log(req.body);
    const data=req.body;
    const user=new User(data);
    const result=await user.save();
    delete result.password;
    Jwt.sign({result}, jwtKey, {expiresIn:"2h"},(err,token)=>{
        if(err){
            res.send("Something went wrong")  
        }
        res.send({result,auth:token})
    })
})
app.get('/get',async(req,res)=>{
    const data=await User.find();
    res.send(JSON.stringify(data));
})
app.delete('/delete/:id',async(req,res)=>{
    const data=await User.deleteOne({ _id: req.params.id });
    res.send(JSON.stringify(data));
})
app.post('/login',async(req,res)=>{
    console.log("hello");
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({user}, jwtKey, {expiresIn:"2h"},(err,token)=>{
                if(err){
                    res.send("Something went wrong")  
                }
                res.send({user,auth:token})
            })
        } else {
            res.send({ result: "No User found" })
        }
    } else {
        res.send({ result: "No User found" })
    }
       
})
app.patch('/update/:id', async(req,res)=>{
     const data=User.findOne({_id:req.params.id});
     if(req.body.email)
         data.email=req.body.email;
     if(req.body.password)
         data.password=req.body.password;
     if(req.body.name)
         data.name=req.body.name;
    const response=await User.updateOne({ _id: req.params.id },
        { $set: req.body });
    res.send(response);
})
app.listen(4000,()=>{
    console.log("connected to port");
})


