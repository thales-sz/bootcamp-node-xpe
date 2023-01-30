import { NextFunction, Request, Response } from "express";

const errorHandler = (error: Error, _req: Request, res: Response)=> {
  console.log("### Error Handler");
  console.log('error',error);
  res.status(500).json(error);
}

export default errorHandler;