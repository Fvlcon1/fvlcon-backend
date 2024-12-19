import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { SegmentationLogs, Stream, User } from "@prisma/client";
import { SegmentationLogsService } from './segmentationLogs.service';
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { SegmentationLogsDto } from "./segmentationLogs.type";

@ApiTags("Segmentation logs")
@Controller('segmentationLogs')
export class SegmentationLogsController{
    constructor(private segmentationLogsService: SegmentationLogsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAllSegmentationLogs')
    async getALlSegmentationLogs(@IUser() user : JwtPayload) : Promise<SegmentationLogs[]>{
        try {
            return await this.segmentationLogsService.getAllSegmentationLogs(user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('addSegmentationLogs')
    async addSegmentationLogs(@Body() body : SegmentationLogsDto, @IUser() user : JwtPayload) : Promise<SegmentationLogs>{
        try {
            return await this.segmentationLogsService.addSegmentationLogs(body, user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteSegmentationLog/:id')
    async deleteSegmentationLog(@Param("id") id : string) : Promise<SegmentationLogs>{
        try {
            return await this.segmentationLogsService.deleteSegmentationLogs(id)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getUploadPresignedUrl/')
    async getUploadPresignedUrl(@Query("filename") filename? : string) : Promise<string | BadRequestException>{
        try {
            return await this.segmentationLogsService.generateUploadPresignedUrl(filename)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}