import { Controller, Get, HttpException, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { Stream, User } from "@prisma/client";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";

@ApiTags("User")
@Controller('user')
export class UserController{
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getUserDetails/')
    getAllStreams(@IUser() user : JwtPayload) : Promise<User[]>{
        console.log({user})
        try {
            return this.userService.getUserDetails(user.userId)
        } catch (error) {
            throw new NotFoundException()
        }
    }
}