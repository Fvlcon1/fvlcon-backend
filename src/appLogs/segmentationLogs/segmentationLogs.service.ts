import { Injectable } from '@nestjs/common';
import { SegmentationLogs } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SegmentationLogsDto } from './segmentationLogs.type';

@Injectable()
export class SegmentationLogsService {
    constructor(private prisma: PrismaService) {}

    async getAllSegmentationLogs(userId : string) : Promise<SegmentationLogs[]> {
        return await this.prisma.segmentationLogs.findMany({
            where : { userId }
        })
    }

    async addSegmentationLogs(data : SegmentationLogsDto, userId : string) : Promise<SegmentationLogs> {
        const add = await this.prisma.segmentationLogs.create({
            data : {
                user : { connect : { id : userId}},
                ...data
            }
        })
        return add
    }

    async deleteSegmentationLogs(id : string) : Promise<SegmentationLogs> {
        return await this.prisma.segmentationLogs.delete({where : {id}})
    }
}
