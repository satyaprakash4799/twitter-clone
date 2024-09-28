import dotenv from 'dotenv';

dotenv.config();


import express, { Request, Response} from 'express';
import { connectDB } from './config/dbConnection';
import { StatusCodes } from 'http-status-codes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { router } from './routes';


import * as _Models from './models';


const app = express();
const port = process.env.PORT || 4000;

// db connection
connectDB();

// Middleware to parse incoming request
app.use(express.json())

// router
app.use(router);

// error middleware
app.use(errorMiddleware);

app.use('*', (req: Request, res: Response) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    message:'Invalid api request.'
  })
})


app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
})