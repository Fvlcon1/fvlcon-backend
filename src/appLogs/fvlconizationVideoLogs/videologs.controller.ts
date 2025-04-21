import { BadRequestException, Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { VideoLogsService } from "./videologs.service";
import { FvlconizationLogs, FvlconizationVideoLogs } from "@prisma/client";
import { User as IUser } from "src/decorators/user.decorator";
import { JwtAuthGuard } from "src/guards/jwt.guards";
import { JwtPayload } from "src/types/@types";

@ApiTags("Fvlconization Video logs")
@Controller('videologs')
export class VideoLogsController{
    constructor(private videologsService: VideoLogsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('video-log/:id')
    async getFvlconizationLog(@IUser() user : JwtPayload, @Param("id") id : string) : Promise<FvlconizationVideoLogs>{
        try {
            return await this.videologsService.getVideoLog({id, userId : user.userId})
        } catch (error : any) {
            console.log({error})
            throw new BadRequestException(error.message)
        }
    }
}