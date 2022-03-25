const express = require("express")
const router=express.Router();
const gravatar = require("gravatar")
const bcrypt = require("bcrypt")
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
const config = require("config")
const { check,validationResult }=require("express-validator")
const User=require("../../models/User")
const connectDB=require("../../config/db");


router.post("/",[
    check("name","Name is required")
        .not()
        .isEmpty(),
    check("phonenumber","phone number is reuired").isLength(10),
    check("email","please include a valid email").isEmail(),
    check("username","username is rquired") .not().isEmpty(),
    check(
        "password",
        "please enter a password with 6 or more characters"
    ).isLength({ min:6 ,max:12 }),

    //    confirmation password
    check("password").custom((password,{req}) => {
        if (password !== req.body.passwordconfirmation){ app = express()
            throw new Error("password confirmation is incorrect")
        }
        return true
    }),
    //    confirmation phonenumbr
    check("phonenumber").custom((phonenumber,{req}) => {
        if (phonenumber !== req.body.phonenumberconfirmation){
            throw new Error("phonenumber confirmation is incorrect")
        }
        return true
    }),
    // email checking
    check("email").custom(async(email) => {
      const user=await User.findOne({ email})
      if (user){
          throw new Error("email is already exist")
      }
      return true
    })

],
async(req,res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({errors: errors.array()})
        return;
    }
    const { name,email,password, username, phonenumber,passwordconfirmation,phonenumberconfirmation}=req.body;

    try{
        const avatar = gravatar.url(email, {
            s: "200",                          
            r: "pg",                           
            d: "mm"                             
        })

        const user = new User({
            name,
            email,
            avatar,
            password,
            username,
            phonenumber,
            passwordconfirmation,
            phonenumberconfirmation
        })
      
        const salt = await bcrypt.genSalt(10);   

        user.password = await bcrypt.hash(password,salt)

        res.send(`registerd successfully${user}`)
        await user.save();


    }catch(err){
        console.error(err.message);
        res.status(500).send("server error");
         
    }   
})

module.exports = router;
