const express = require("express");
const connectDB = require("./config/db")
const app = express()

connectDB()


app.use(express.json({extended:false})) 

app.get("/",() => console.log("api running"));

app.use("/api/user",require("./routes/api/user"));



const PORT=process.env.PORT || 7000
app.listen( PORT,()=> console.log("server started..."))