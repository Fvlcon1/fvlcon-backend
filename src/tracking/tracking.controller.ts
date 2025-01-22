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
export class TrackingController{
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
            const {base64Image} = param
            if(!base64Image)
                return new BadRequestException("Image parameter is required")
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
    async getTrackingDataByTimeRange(@IUser() user : JwtPayload, @Query() query : {faceId : string, startTime : string, endTime : string}) : Promise<any>{
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
    async getTrackingDataByUserIdAndTimeRange(@IUser() user : JwtPayload, @Query() query : {startTime : string, endTime : string}) : Promise<any>{
        const {startTime, endTime} = query
        try {
            return this.trackingService.getTrackingDataByUserIdAndTimeRange(user.userId, startTime, endTime)
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

    @UseGuards(JwtAuthGuard)
    @Get('searchNumberPlatePartial')
    async searchNumberPlatePartial(@Query("numberPlate") numberPlate : string ) : Promise<any>{
        try {
            return this.trackingService.searchNumberPlatePartial(numberPlate)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }

    @Get('getTrackingDetailsByNumberPlateAndTimestamp')
    async getTrackingDetailsByNumberPlateAndTimestamp(@Query() query : {plateNumber : string, startTime : string, endTime : string}) : Promise<any>{
        const {plateNumber, startTime, endTime} = query
        try {
            return this.trackingService.getTrackingDetailsByNumberPlateAndTimestamp(plateNumber, startTime, endTime)
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }
}