import { plainToClass } from "class-transformer";
import { validateSync } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { Controller, Post } from "../decorators/router.decorators";
import { UserModel } from "../models/user.model";
import { compareHashString, errorHandler, jwtGenerator } from "../modules/utils";
import { IUser } from "../types/user.types";
import { RegisterDTO } from "./auth.dto";
import { AuthService } from "./auth.service";
const authService: AuthService = new AuthService();
@Controller('/auth')
export class AuthController {
    @Post()
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const registerDto: RegisterDTO = plainToClass(RegisterDTO, req.body, {excludeExtraneousValues: true});
            const user: IUser = await authService.register(registerDto)
            return res.send(user)
        } catch (error) {
            console.log(error);
            
            next(error)
        }
    }
    @Post()
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, password } = req.body;
            const existUser: IUser | null = await UserModel.findOne({ username });
            if (!existUser) throw { status: 401, message: "the username or password is incorrect" }
            const isTrueUser: boolean = compareHashString(password, existUser.password)
            if (!isTrueUser) throw { status: 401, message: "the username or password is incorrect" }
            await jwtGenerator({ username, id: existUser._id })
            const user = await UserModel.findById(existUser._id, { __v: 0, password: 0 })
            return res.json({
                statusCode: 200,
                data: {
                    user
                }
            })
        } catch (error) {
            next(error)
        }
    }
}