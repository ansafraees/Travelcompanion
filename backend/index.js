const cors =require('cors')
const express=require('express')
const app=express()
const routes=require("./routers")
const mongoose=require('mongoose')

require('dotenv').config()

app.use(express.json())
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PATCH','DELETE'],
    allowedHeaders:['Content-Type'],  
    credentials:true  
}))
app.use('/api/v1/users',routes)

const port=process.env.PORT

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } 
    catch (error) {
        console.log(error);
    }
}

start();