import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'


const app = express()


//Connect to Database
await connectDB()


//Global Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())


//Routes
app.get('/', (req, res)=> res.send('API Working'))
app.post('/clerk', clerkWebhooks)
app.use('/api/educator', educatorRouter)


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})