import { validateSync } from "class-validator";
import { UserModel } from "../models/user.model";
import { errorHandler, HashString } from "../modules/utils";
import { IUser } from "../types/user.types";
import { RegisterDTO } from "./auth.dto"
export class AuthService {
    async register(userDto: RegisterDTO): Promise<IUser> {
        const errors = validateSync(userDto)
        const checkedErrors = errorHandler(errors);
        if(checkedErrors.length > 0) throw {status: 400, errors: checkedErrors, message: "validation Error"}
        const existUser = await UserModel.findOne({ username: userDto.username });
        if (existUser) throw { status: 400, message: "this username already exist" }
        const newPassword = HashString(userDto.password)
        userDto.password = newPassword
        const user: IUser = await UserModel.create(userDto)
        return user
    }
}