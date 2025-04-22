import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'


const app = express()


//Connect to Database
await connectDB()


//Global Middlewares
app.use(cors())

//Routes
app.get('/', (req, res)=> res.send('API Working'))
app.post('/clerk',express.json(), clerkWebhooks)



const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})