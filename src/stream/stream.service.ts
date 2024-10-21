import { Injectable } from '@nestjs/common';
import { Stream } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { IAddNewStreamType } from './stream.type';

@Injectable()
export class StreamService {
    constructor(private prisma: PrismaService) {}

    async getAllStreams() : Promise<Stream[]> {
        return this.prisma.stream.findMany(
            {
                include : {
                    cameraFolder : true
                }
            }
        )
    }

    async getOneStream(id : string) : Promise<Stream> {
        return await this.prisma.stream.findUnique({where : {id}})
    }

    async addNewStream(stream : IAddNewStreamType) : Promise<Stream>{
        return await this.prisma.stream.create({
            data : stream
        })
    }

    async updateStream(stream : Partial<IAddNewStreamType>, id : string) : Promise<Stream>{
        return await this.prisma.stream.update({
            where : {id},
            data : stream
        })
    }

    async deleteStream(id : string) : Promise<Stream>{
        return await this.prisma.stream.delete({where : {id}})
    }
}
