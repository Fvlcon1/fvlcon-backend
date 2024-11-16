import { Injectable } from '@nestjs/common';
import { Stream } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { IAddNewStreamType } from './stream.type';

@Injectable()
export class StreamService {
    constructor(private prisma: PrismaService) {}

    async getAllStreams(id : string) : Promise<Stream[]> {
        return this.prisma.stream.findMany(
            {
                where : {userId : id},
                include : {
                    cameraFolder : true
                }
            }
        )
    }

    async getOneStream(id : string, userId : string) : Promise<Stream> {
        return await this.prisma.stream.findUnique({where : {id, userId}})
    }

    async addNewStream(stream : IAddNewStreamType) : Promise<Stream>{
        return await this.prisma.stream.create({
            data : {
                user : {
                    connect : { id : stream.userId}
                },
                name : stream.name,
                rtspurl : stream.rtspUrl,
                cameraFolder : {
                    connect : {id : stream.cameraFolderId}
                }
            }
        })
    }

    async updateStream(stream : Partial<IAddNewStreamType>, id : string, userId : string) : Promise<Stream>{
        return await this.prisma.stream.update({
            where : {id, userId},
            data : stream
        })
    }

    async deleteStream(id : string, userId : string) : Promise<Stream>{
        return await this.prisma.stream.delete({where : {id, userId}})
    }
}
