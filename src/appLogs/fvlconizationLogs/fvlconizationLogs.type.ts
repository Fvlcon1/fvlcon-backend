import { MediaTypes, StatusTypes } from "@prisma/client"
import { IMediaTypes } from "src/types/@types"

export type FvlconizationLogsDto = {
    type : MediaTypes
    media : object[]
    date : Date
    uploadedImageS3key : string
    timeElapsed : number
    status : StatusTypes
}

export interface Filters {
    startDate?: Date;
    endDate?: Date;
    status?: StatusTypes;
    type?: MediaTypes;
}