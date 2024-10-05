import dotenv from 'dotenv';

dotenv.config();


import express, { Request, Response} from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

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
// app.use(express.json())

// middleware to parse incoming request
app.use(bodyParser.json());
// middleware to parse urlencoded request
app.use(bodyParser.urlencoded({extended: true}));

// multer configuration for form-data
const storage = multer.memoryStorage();
const upload = multer({storage});
app.use(upload.any());


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