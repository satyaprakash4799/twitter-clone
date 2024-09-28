import dotenv from 'dotenv';

dotenv.config();


import express, { Request, Response} from 'express';
import { connectDB } from './config/dbConnection';
import {userRoute} from './routes/userRoute';
import { StatusCodes } from 'http-status-codes';
import { errorMiddleware } from './middleware/errorMiddleware';


const _Models = require('./models');


const app = express();
const port = process.env.PORT || 4000;

// db connection
connectDB();

// Middleware to parse incoming request
app.use(express.json())

app.use('/user', userRoute);
app.use(errorMiddleware);
app.use('*', (req: Request, res: Response) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    message:'Invalid api request.'
  })
})


app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
})