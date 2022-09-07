import express from "express";
import { Application, Request, Response, NextFunction } from "express";
import http, { Server } from "http"
import ApplicationRouter from "./routes/index.routes";
import { ResponseMethod } from "./types/public.types";
import "./app.module"
import "./modules/mongoDBConnection"
const app: Application = express();
const server: Server = http.createServer(app);
const PORT = 5600
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(ApplicationRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
    const response: ResponseMethod = {
        statusCode: 404,
        message: "NotFoundPage"
    }
    return res.status(404).json(response)
})
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode: number = +error?.status || 500
    const message:string = error?.message || "internalServerError"
    const response: ResponseMethod = {
        statusCode,
        message, 
        errors : error?.errors || []
    }
    return res.status(statusCode).json(response)
})
server.listen(PORT, () => {
    console.log(`Server Run over: http://localhost:${PORT}`); 
})