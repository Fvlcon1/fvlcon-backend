import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CameraFolder, Stream } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ICreateFolderType } from './camFolder.types';

@Injectable()
export class CameraFolderService {
    constructor(private prisma: PrismaService) {}

    async getAllFolders(userId : string) : Promise<CameraFolder[]> {
        return await this.prisma.cameraFolder.findMany({where : {userId}})
    }

    async getOneFolder(id : string, userId : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.findUnique({where : {id, userId}})
    }

    async addFolder(folderDetails : ICreateFolderType, userId : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.create({
            data : {
                userId,
                ...folderDetails
            }
        })
    }

    async updateFolder(folderDetails : ICreateFolderType, id : string, userId : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.update({
            where : {id, userId},
            data : folderDetails
        })
    }

    async deleteFolder(id : string, userId : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.delete({
            where : {id, userId}
        })
    }
}
