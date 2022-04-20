const express =require('express');
const router=express.Router();
const signuptemplatecopy=require('../moduls/signuomodules')
const bcrypt =require('bcrypt')
router.post('/signup', async(req,res)=>{
    const saltpassword=await bcrypt.genSalt(10)
    const secuerdpassword=await bcrypt.hash(req.body.password,saltpassword)
    const signupuser=new signuptemplatecopy({

        fullname:req.body.fullname,
        username:req.body.username,
        email:req.body.email,
        password:secuerdpassword

    })
    signupuser.save()
    .then(data=>{
        res.json(data)
    })
    .catch(err=>{
        res.json(err)
    })
})

 module.exports=router