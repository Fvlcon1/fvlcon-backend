import { MediaTypes, StatusTypes } from "@prisma/client"

export type SegmentationLogsDto = {
    type : MediaTypes
    media : Media[]
    date : Date
    uploadedImageS3key : string
    timeElapsed : number
    status : StatusTypes
}
export interface Media {
    segmentedImageS3Key : string,
    accuracy : number,
    status : StatusTypes
}

export interface Filters {
    startDate?: Date;
    endDate?: Date;
    status?: StatusTypes;
    type?: MediaTypes;
    page? : number,
    pageSize? : number
}