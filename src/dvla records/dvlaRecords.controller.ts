import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtPayload } from "src/types/@types";
import { addRecordDto, getRecordDto } from './dvlaRecords.dto';
import { DvlaRecordService } from './dvlaRecords.service';

@ApiTags("Dvla records")
@Controller('dvlarecords')
export class DvlaRecordController{
    constructor(private dvlaRecordService: DvlaRecordService) {}

    // @UseGuards(JwtAuthGuard)
    @Post('addDvlaRecord')
    @UsePipes(new ValidationPipe())
    async addDvlaRecord(@Body() body : addRecordDto){
        try {
            return await this.dvlaRecordService.addDvlaRecord(body)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }

    // @UseGuards(JwtAuthGuard)
    @Get('getDvlaRecord')
    @UsePipes(new ValidationPipe())
    async getDvlaRecord(@Query() params : getRecordDto){
        try {
            return await this.dvlaRecordService.getDvlaRecord(params)
        } catch (error : any) {
            throw new BadRequestException(error.message)
        }
    }
}