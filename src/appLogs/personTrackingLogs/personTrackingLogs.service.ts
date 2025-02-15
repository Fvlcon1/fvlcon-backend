import { Injectable } from '@nestjs/common';
import { PersonTracking } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PersonTrackingLogsDto } from './personTrackingLogs.type';

@Injectable()
export class PersonTrackingLogsService {
    constructor(private prisma: PrismaService) {}

    async getAllPersonTrackingLogs(userId : string) : Promise<PersonTracking[]> {
        return await this.prisma.personTracking.findMany({
            where : { userId },
            orderBy: {
                date: 'desc',
            },
        })
    }

    // async addPersonTrackingLogs(data : PersonTrackingLogsDto, userId : string) : Promise<PersonTracking> {
    //     const add = await this.prisma.personTracking.create({
    //         data : {
    //             User : { connect : { id : userId}},
    //             ...data
    //         }
    //     })
    //     return add
    // }

    async deletePersonTrackingLogs(id : string) : Promise<PersonTracking> {
        return await this.prisma.personTracking.delete({where : {id}})
    }
}
