import { Injectable } from '@nestjs/common';
import { PlateTracking } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PlateTrackingLogsDto } from './plateTrackingLogs.type';

@Injectable()
export class PlateTrackingLogsService {
    constructor(private prisma: PrismaService) {}

    async getAllPlateTrackingLogs(userId : string) : Promise<PlateTracking[]> {
        return await this.prisma.plateTracking.findMany({
            where : { userId }
        })
    }

    async addPlateTrackingLogs(data : PlateTrackingLogsDto, userId : string) : Promise<PlateTracking> {
        const add = await this.prisma.plateTracking.create({
            data : {
                User : { connect : { id : userId}},
                ...data
            }
        })
        return add
    }

    async deletePlateTrackingLogs(id : string) : Promise<PlateTracking> {
        return await this.prisma.plateTracking.delete({where : {id}})
    }
}
