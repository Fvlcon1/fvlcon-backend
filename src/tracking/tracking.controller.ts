import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { Stream, User } from "@prisma/client";
import { TrackingService } from "./tracking.service";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { IGetTrackingDataParams, ISearchFaceByImageParams } from "./tracking.type";

@ApiTags("Tracking")
@Controller('tracking')
export class StreamController{
    constructor(private trackingService: TrackingService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getTrackingData')
    async getOneStream(@IUser() user : JwtPayload, @Query() params : IGetTrackingDataParams) : Promise<any>{
        try {
            return this.trackingService.getTrackingData(params, user.userId)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('searchFaceByImage')
    async searchFaceByImage(@Body() param : ISearchFaceByImageParams) : Promise<any>{
        try {
            const {base64Image, collectionId} = param
            if(!base64Image)
                return new BadRequestException("Image parameter is required")
            if(!collectionId)
                return new BadRequestException("collectionId parameter is required")
            return this.trackingService.searchFaceByImage(param)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('SearchByText')
    async searchByText(@Query() query : any) : Promise<any>{
        try {
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('generatePresignedUrl/:key')
    async generatePresignedUrl(@Param('key') key : string) : Promise<any>{
        try {
            return this.trackingService.generatePresignedUrl(key)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getTrackingDataByTimeRange')
    async getTrackingDataByTimeRange(@Query() query : {faceId : string, startTime : string, endTime : string}) : Promise<any>{
        const {faceId, startTime, endTime} = query
        try {
            return this.trackingService.getTrackingDataByTimeRange(faceId, startTime, endTime)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getTrackingDataByUserIdAndTimeRange')
    async getTrackingDataByUserIdAndTimeRange(@Query() query : {userId : string, startTime : string, endTime : string}) : Promise<any>{
        const {userId, startTime, endTime} = query
        try {
            return this.trackingService.getTrackingDataByUserIdAndTimeRange(userId, startTime, endTime)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getTrackingDataById/:id')
    async getTrackingDataById(@Param("id") id : string ) : Promise<any>{
        try {
            return this.trackingService.getTrackingDataById(id)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }
}