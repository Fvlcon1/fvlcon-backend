import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { addRecordDto, getRecordDto } from './criminalRecords.dto';
import { CriminalRecordsService } from './criminalRecords.service';
import { CriminalRecord } from "@prisma/client";

@ApiTags("Criminal records")
@Controller('criminalRecords')
export class CriminalRecordsController{
    constructor(private criminalRecordsService: CriminalRecordsService) {}

    // @UseGuards(JwtAuthGuard)
    @Post('addCriminalRecord')
    @UsePipes(new ValidationPipe())
    async addCriminalRecord(@Body() body : addRecordDto) : Promise<CriminalRecord>{
        try {
            return await this.criminalRecordsService.addCriminalRecord(body)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    // @UseGuards(JwtAuthGuard)
    @Get('getCriminalRecords')
    @UsePipes(new ValidationPipe())
    async getCriminalRecords(@Query() params : getRecordDto) : Promise<CriminalRecord[]>{
        try {
            return await this.criminalRecordsService.getCriminalRecord(params)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}