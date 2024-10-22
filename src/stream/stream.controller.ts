import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Stream, User } from "@prisma/client";
import { StreamService } from "./stream.service";
import { IAddNewStreamType } from "./stream.type";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";

@ApiTags("Stream")
@Controller('stream')
export class StreamController{
    constructor(private streamService: StreamService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAllStreams')
    async getAllStreams(@IUser() user : JwtPayload) : Promise<Stream[]>{
        try {
            return await this.streamService.getAllStreams(user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('getOneStream/:id')
    async getOneStream(@Param("id") id : string, @IUser() user : JwtPayload) : Promise<Stream>{
        try {
            return await this.streamService.getOneStream(id, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('addNewStream')
    async addNewStream(@Body() stream : IAddNewStreamType, @IUser() user : JwtPayload) : Promise<Stream> {
        try {
            return await this.streamService.addNewStream({
                userId : user.userId,
                ...stream
            })
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Patch('updateStream/:id')
    async updateStream(@Body() stream : Partial<IAddNewStreamType>, @IUser() user : JwtPayload, @Param("id") id : string) : Promise<Stream> {
        try {
            return await this.streamService.updateStream(stream, id, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteStream/:id')
    async deleteStream(@Param("id") id : string, @IUser() user : JwtPayload) : Promise<Stream> {
        try {
            return await this.streamService.deleteStream(id, user.userId)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}