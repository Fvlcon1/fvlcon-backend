import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CameraFolder, Stream, User } from "@prisma/client";
import { CameraFolderService } from "./camFolder.service";
import { ICreateFolderType } from "./camFolder.types";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from 'src/decorators/user.decorator';
import { JwtPayload } from "src/types/@types";

@ApiTags("Camera Folder")
@Controller('cameraFolder')
export class CameraFolderController{
    constructor(private cameraFolderService: CameraFolderService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAllFolders')
    async getAllFolders(@IUser() user : JwtPayload) : Promise<CameraFolder[]>{
        try {
            return await this.cameraFolderService.getAllFolders(user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getOneFolder/:id')
    async getOneFolder(@Param("id") id : string, @IUser() user : JwtPayload ) : Promise<CameraFolder>{
        try {
            return await this.cameraFolderService.getOneFolder(id, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('addFolder')
    async addFolder(@Body() body : ICreateFolderType, @IUser() user : JwtPayload){
        try {
            return await this.cameraFolderService.addFolder(body, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('updateFolder/:id')
    async updateFolder(@Body() body : ICreateFolderType, @Param("id") id : string, @IUser() user : JwtPayload){
        try {
            return await this.cameraFolderService.updateFolder(body, id, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteFolder/:id')
    async deleteFolder(@Param("id") id : string, @IUser() user : JwtPayload){
        try {
            return await this.cameraFolderService.deleteFolder(id, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}