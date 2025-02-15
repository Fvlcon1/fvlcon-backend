import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber } from 'class-validator';

export class addRecordDto {

}

export class getRecordDto {
    @IsString()
    plateNumber : string
}