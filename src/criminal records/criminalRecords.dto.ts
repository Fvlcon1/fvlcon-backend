import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber } from 'class-validator';

export class addRecordDto {
    @IsString()
    personId: string;

    @Type(() => Date)
    @IsDate()
    arrestDate: Date;

    @IsString()
    arrestingOfficer: string;

    @IsString()
    criminalRecordId: string;

    @IsString()
    offenceTypee: string;

    @IsNumber()
    sentenceLengthMonths: number;

    @IsString()
    niaTableId: string;
}

export class getRecordDto {
    @IsString()
    niaTableId : string
}