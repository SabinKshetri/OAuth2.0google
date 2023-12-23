const express=require('express')
const app=express()

app.set("view engine","ejs")
//Requires here
require("dotenv").config()
const passport=require("passport")


//middlewares and configuration for the google login
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user,cb){
    cb(null,user)
})
passport.deserializeUser(function(obj,cb){
    cb(null,obj)
})


//google login here
var userProfile;
let GoogleStrategy=require('passport-google-oauth').OAuth2Strategy


passport.use(new GoogleStrategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/callback"
},
function(accessToken,refreshToken,profile,done){
    console.log(profile,accessToken)
 userProfile=profile
 return done(null,userProfile)

}
))

app.get("/auth/google",passport.authenticate("google",{scope:['profile','email']}))

app.get("/auth/google/callback",passport.authenticate("google",{
    failureRedirect:"http://localhost:3000"
}),
function(req,res){
    res.send("logged in successfully!!!")
}
)


//google login ends here

//database
require("./Model/index")


app.get("/",(req,res)=>{
    res.render("home")
})

const PORT=process.env.PORT ||4000
app.listen(PORT,()=>{
    console.log(`Project Running in PORT:${PORT}`)
})