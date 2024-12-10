import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PlateTracking, Stream, User } from "@prisma/client";
import { PlateTrackingLogsService } from './plateTrackingLogs.service';
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { PlateTrackingLogsDto } from "./plateTrackingLogs.type";

@ApiTags("PlateTracking logs")
@Controller('plateTrackingLogs')
export class PlateTrackingLogsController{
    constructor(private plateTrackingLogsService: PlateTrackingLogsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAllPlateTrackingLogs')
    async getALlPlateTrackingLogs(@IUser() user : JwtPayload) : Promise<PlateTracking[]>{
        try {
            return await this.plateTrackingLogsService.getAllPlateTrackingLogs(user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('addPlateTrackingLogs')
    async addPlateTrackingLogs(@Body() body : PlateTrackingLogsDto, @IUser() user : JwtPayload) : Promise<PlateTracking>{
        try {
            return await this.plateTrackingLogsService.addPlateTrackingLogs(body, user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deletePlateTrackingLog/:id')
    async deletePlateTrackingLog(@Param("id") id : string) : Promise<PlateTracking>{
        try {
            return await this.plateTrackingLogsService.deletePlateTrackingLogs(id)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}