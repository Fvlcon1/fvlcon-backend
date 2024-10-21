import { Controller, Get, HttpException, NotFoundException, Param } from "@nestjs/common";
import { Stream, User } from "@prisma/client";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(private userService: UserService) {}

    @Get('getUserDetails/:id')
    getAllStreams(@Param("id") id : string) : Promise<User[]>{
        try {
            return this.userService.getUserDetails(id)
        } catch (error) {
            throw new NotFoundException()
        }
    }
}