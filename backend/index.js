const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()

const corsOptions = {
    origin: 'https://3000-majeduldev-ecom-dxiwo2blvmm.ws-us117.gitpod.io', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true // Allow cookies and authentication headers
};
  
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.use("/api",router)

const PORT = 8080;


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
