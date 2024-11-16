import { Body, Controller, Get, HttpException, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { Stream, User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";

@ApiTags("Auth")
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('login/')
    getAllStreams(@Body() body : { email : string, password : string, companyCode : string}) : Promise<User[]>{
        const { email, password, companyCode } = body
        try {
            return this.authService.login(email, password, companyCode)
        } catch (error) {
            throw new NotFoundException()
        }
    }
}