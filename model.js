const { express } = require('express');
const mongoose=require('mongoose');

const user=mongoose.Schema(
    {
        name:{
            type:String
        },
        email:{
            type:String
        },
        password:{
            type:String
        }
    }
);

module.exports=new mongoose.model('user',user);