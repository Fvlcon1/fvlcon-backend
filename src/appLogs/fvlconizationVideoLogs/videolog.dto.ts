import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber } from 'class-validator';

export class GetVideoLogDTO {
    @IsString()
    id : string

    @IsString()
    userId : string
}