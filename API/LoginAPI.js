const express = require('express');
const router = express.Router();
const userDB = require('../DBmodels/UserDB');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const JWT = require('jsonwebtoken');
const JWTsecret = process.env.REACT_JSONWEBTOKEN_SECRET ;
const randomOTP = require('random-otp-generator');
const UserDB = require('../DBmodels/UserDB');

router.post('/login',async(req,res)=>{
try{
    const {username,password}=req.body;
    const User = await userDB.findOne({email:username});
    if(User){
        if(User.verified){
            const verifyPassword = await bcrypt.compare(password,User.password)
            if(!verifyPassword){
                res.status(500).send({success:false,message:'Invalid email or Password'})
            }else{
                const data = {
                    user:{
                        id:User._id,
                        name:User.name
                    }
                };
                const AuthToken = JWT.sign(data,JWTsecret);
                res.status(200).send({success:true,message:'Login Success',Token:AuthToken});
            }
        }else{
            res.status(500).send({success:false,message:'Verify Email to Login'})
        }
    }else{
        res.status(500).send({success:false,message:'Invalid email or Password'})
    }

}catch(error){
    res.status(404).send({success:false,message:'Error Occured Please try again'})
}

});

router.post('/signup',async(req,res)=>{
    try{
        const {username,email,password,mobilenumber}=req.body;
        //checking if the user already exists!!!
        const CheckUser = await userDB.findOne({email:email});
        if(CheckUser){
            res.send({success:false,message:'user Already exists'});
        }else{
            //encrypting the password
            const salt = await bcrypt.genSaltSync(10);
            const Securepassword = await bcrypt.hash(password,salt);
            const otp = Math.floor(100000+Math.random()*900000);
            
            const NewUser = {   name:username,
                                email:email,
                                password:Securepassword,
                                mobilenumber:mobilenumber,
                                otp:otp };
            const CreateUser = await userDB.create(NewUser);
            if(CreateUser){
                res.status(200).send({success:true,message:`OTP Sent to ${email}`});
            }
            
        }


    }catch(error){
            
    }
})

router.post('/verifyotp',async(req,res)=>{
    try{
        const {email,otp}=req.body;
        const FindUser = await userDB.findOne({email:email});
        if(FindUser){
           
            if(otp == FindUser.otp){
                await userDB.findByIdAndUpdate(FindUser._id,{$set:{verified:true,otp:null}},{new:true});
                res.status(200).send({success:true,message:'Verification Success Login to Continue'})

            }else{
                res.status(500).send({success:false,message:'Invalid OTP Try Again'})
            }
        }

    }catch(error){
        res.status(404).send({success:false,message:'Error Occured Try again'})
    }
})

router.post('/forgot-password',async(req,res)=>{
    try{
        const {email}= req.body;
        const FindUser = await userDB.findOne({email:email});
        if(FindUser){
            const otp = Math.floor(100000 + Math.random()*900000);
            await userDB.findByIdAndUpdate(FindUser._id,{$set:{otp:otp}},{new:true});
            res.status(200).send({success:true,message:`OTP Sent to ${email.slice(0,5)}***${email.slice(-8)}`});
        }else{
            res.status(500).send({success:false,message:'User Does not exists'});
        }
    }catch(Error){
        res.status(404).send({success:false,message:'Error Occured Try again'})

    }
});

router.post('/update-password',async(req,res)=>{
    const {password,otp,email}=req.body;
    try{
        const FindUser = await UserDB.findOne({email:email});
        if(FindUser){
            if(FindUser.otp==otp){
                const salt = await bcrypt.genSaltSync(10);
                const SecurePassword = await bcrypt.hash(password,salt);
                await UserDB.findByIdAndUpdate(FindUser._id,{$set:{password:SecurePassword,otp:null}},{new:true})
                res.status(200).send({success:true,message:'Password Changed Succesfully!!'})

            }else{
                res.status(500).send({success:false,message:'Invalid OTP Please Try agian'})
            }
        }else{


        }
    }catch(error){
        res.status(404).send({success:false,message:'Error Occured Try again'})
    }
})
module.exports = router;