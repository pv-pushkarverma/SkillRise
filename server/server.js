import express, { json } from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'



const app = express()


//Connect to Database
await connectDB()
await connectCloudinary()



//Global Middlewares
app.use(cors())
app.use(clerkMiddleware())


app.post('/stripe',express.raw({type: 'application/json'}), stripeWebhooks)

//stripe needs raw body so move this after stripe
app.use(express.json())


//Routes
app.get('/', (req, res)=> res.send('API Working'))
app.post('/clerk', clerkWebhooks)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})