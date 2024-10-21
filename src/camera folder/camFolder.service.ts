import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CameraFolder, Stream } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ICreateFolderType } from './camFolder.types';

@Injectable()
export class CameraFolderService {
    constructor(private prisma: PrismaService) {}

    async getAllFolders() : Promise<CameraFolder[]> {
        return await this.prisma.cameraFolder.findMany()
    }

    async getOneFolder(id : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.findUnique({where : {id}})
    }

    async addFolder(folderDetails : ICreateFolderType) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.create({
            data : folderDetails
        })
    }

    async updateFolder(folderDetails : ICreateFolderType, id : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.update({
            where : {id},
            data : folderDetails
        })
    }

    async deleteFolder(id : string) : Promise<CameraFolder> {
        return await this.prisma.cameraFolder.delete({
            where : {id}
        })
    }
}
