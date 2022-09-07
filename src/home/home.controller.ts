import { NextFunction, Request, Response } from "express";
import { Controller, Get } from "../decorators/router.decorators";
@Controller('/users')
export class HomeController{
    @Get()
    GetHomeInfo(req: Request, res:Response, next: NextFunction){
        try {
            return res.send("users")
        } catch (error) {
            next(error)
        }
    }
}