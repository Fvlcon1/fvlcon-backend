import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post } from "@nestjs/common";
import { CameraFolder, Stream, User } from "@prisma/client";
import { CameraFolderService } from "./camFolder.service";
import { ICreateFolderType } from "./camFolder.types";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Camera Folder")
@Controller('cameraFolder')
export class CameraFolderController{
    constructor(private cameraFolderService: CameraFolderService) {}

    @Get('getAllFolders')
    async getAllFolders() : Promise<CameraFolder[]>{
        try {
            return await this.cameraFolderService.getAllFolders()
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Get('getOneFolder/:id')
    async getOneFolder(@Param("id") id : string ) : Promise<CameraFolder>{
        try {
            return await this.cameraFolderService.getOneFolder(id)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Post('addFolder')
    async addFolder(@Body() body : ICreateFolderType){
        try {
            return await this.cameraFolderService.addFolder(body)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Patch('updateFolder/:id')
    async updateFolder(@Body() body : ICreateFolderType, @Param("id") id : string){
        try {
            return await this.cameraFolderService.updateFolder(body, id)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @Delete('deleteFolder/:id')
    async deleteFolder(@Param("id") id : string){
        try {
            return await this.cameraFolderService.deleteFolder(id)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}