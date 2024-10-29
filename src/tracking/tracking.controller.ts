import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Stream, User } from "@prisma/client";
import { TrackingService } from "./tracking.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { IGetTrackingDataParams } from "./tracking.type";

@ApiTags("Stream")
@Controller('tracking')
export class StreamController{
    constructor(private trackingService: TrackingService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getTrackingData')
    async getOneStream(@IUser() user : JwtPayload, @Param() params : IGetTrackingDataParams) : Promise<any>{
        try {
            return this.trackingService.getTrackingData(params, user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}