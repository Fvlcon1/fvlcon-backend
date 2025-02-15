import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PersonTracking, Stream, User } from "@prisma/client";
import { PersonTrackingLogsService } from './personTrackingLogs.service';
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { PersonTrackingLogsDto } from "./personTrackingLogs.type";

@ApiTags("PersonTracking logs")
@Controller('personTrackingLogs')
export class PersonTrackingLogsController{
    constructor(private personTrackingLogsService: PersonTrackingLogsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAllPersonTrackingLogs')
    async getALlPersonTrackingLogs(@IUser() user : JwtPayload) : Promise<PersonTracking[]>{
        try {
            return await this.personTrackingLogsService.getAllPersonTrackingLogs(user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('addPersonTrackingLogs')
    // async addPersonTrackingLogs(@Body() body : PersonTrackingLogsDto, @IUser() user : JwtPayload) : Promise<PersonTracking>{
    //     try {
    //         return await this.personTrackingLogsService.addPersonTrackingLogs(body, user.userId)
    //     } catch (error : any) {
    //         throw new BadRequestException(error.message)
    //     }
    // }

    @UseGuards(JwtAuthGuard)
    @Delete('deletePersonTrackingLog/:id')
    async deletePersonTrackingLog(@Param("id") id : string) : Promise<PersonTracking>{
        try {
            return await this.personTrackingLogsService.deletePersonTrackingLogs(id)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}