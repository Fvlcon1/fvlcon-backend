import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { FvlconizationLogs, Stream, User } from "@prisma/client";
import { FvlconizationLogsService } from './fvlconizationLogs.service';
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { Filters, FvlconizationLogsDto } from "./fvlconizationLogs.type";

@ApiTags("Fvlconization logs")
@Controller('fvlconizationLogs')
export class FvlconizationLogsController{
    constructor(private fvlconizationLogsService: FvlconizationLogsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAllFvlconizationLogs')
    async getALlFvlconizationLogs(@IUser() user : JwtPayload, @Query() query : Filters) : Promise<FvlconizationLogs[]>{
        const { startDate, endDate, status, type, page, pageSize } = query;
        try {
            return await this.fvlconizationLogsService.getAllFvlconizationLogs(user.userId, {
                startDate,
                endDate,
                status,
                type,
                page : page && parseInt(page as unknown as string), 
                pageSize : pageSize && parseInt(pageSize as unknown as string)
            })
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getFvlconizationLog/:id')
    async getFvlconizationLog(@IUser() user : JwtPayload, @Param("id") id : string) : Promise<FvlconizationLogs>{
        try {
            return await this.fvlconizationLogsService.getFvlconizationLog(id, user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('addFvlconizationLogs')
    async addFvlconizationLogs(@Body() body : FvlconizationLogsDto, @IUser() user : JwtPayload) : Promise<FvlconizationLogs>{
        try {
            return await this.fvlconizationLogsService.addFvlconizationLogs(body, user.userId)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteFvlconizationLog/:id')
    async deleteFvlconizationLog(@Param("id") id : string) : Promise<FvlconizationLogs>{
        try {
            return await this.fvlconizationLogsService.deleteFvlconizationLogs(id)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getUploadPresignedUrl/')
    async getUploadPresignedUrl(@Query("filename") filename? : string) : Promise<string | BadRequestException>{
        try {
            return await this.fvlconizationLogsService.generateUploadPresignedUrl(filename)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}