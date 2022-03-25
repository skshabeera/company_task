const express = require('express');
const router = express.Router();
const {check,validationResult}=require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require ('bcryptjs')
const jwt = require("jsonwebtoken")
const config = require("config")


const User = require ("../../models/User");



router.post("/",
[
    check("name","name is required").not().isEmpty(),
    check(`email`,"please include valid email").isEmail(),
    check("userName","userName is required").not().isEmpty(),
    check("password","password is required").isLength({ min:6 }),
    check("phoneNumber","phone Number is required").isLength(10),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
              throw new Error('Password Confirmation does not match password');
         }
         return true;
    }),
    check('phoneNumber').custom((value, { req }) => {
        if (value !== req.body.phoneNumber) {
              throw new Error('Password Confirmation does not match password');
         }
         return true;
    })
    
],
async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array ()  })
    }
    const { name, email, phoneNumber,userName,password,confirmPassword} = req.body;
    try{
        let user = await User.findOne({ email })
        if(user){
            return  res.status(400).json( { errors: [{ msg : "User already exists"}]});
        }
        const avatar = gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            phoneNumber,
            userName,
            password,
            confirmPassword,
            avatar

            
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        res.send("user registered")
        await user.save()

        
    }catch(err){
        console.error(err.message)
        

        res.status(500).send('server error')

    }
});
module.exports = router;

