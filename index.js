const express = require('express')
const connectDB = require('./config/db')

const app = express()

connectDB()
app.use(express.json({ extended:false }))

app.get('/',(req,res)=>res.send('API running'))
app.use("/api/auth",require("./routes/api/auth"))
app.use("/api/user",require("./routes/api/user"))



const PORT =process.env.PORT || 5000
app.listen(PORT,() => console.log(`Server Started an port ${PORT}`))


