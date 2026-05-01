import express, { NextFunction, Request, Response }  from "express";
import cors from "cors";
import cookieParser from 'cookie-parser'
import  HttpStatus  from "http-status";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";

// middlewares 
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://cineaerse-app.vercel.app','http://localhost:3000',], // Allow requests from this specific origi,
  credentials: true 
},
));


app.use('/api', router)

app.get("/", (req, res) => {
  res.send("Movie server is running!!");
});

 
// global error handler 
app.use(globalErrorHandler);

// not found route handler
app.use((req: Request, res: Response, next: NextFunction)=>{

  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: "Api Not Found",
    error:{
      path: req.originalUrl,
      message: "Your request path is not found!"
    }
  })
})

export default app;  
