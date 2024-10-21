import { HttpException, Injectable } from '@nestjs/common';
import { Stream, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async getUserDetails(id : string) : Promise<User[]> {
        return this.prisma.user.findMany(
            { where : { id } }
        )
    }
}
