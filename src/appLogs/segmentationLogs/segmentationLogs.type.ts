import { IMediaTypes } from "src/types/@types"

export type SegmentationLogsDto = {
    type : IMediaTypes,
    uploadMedia : string[],
    segmentationMedia : string[],
    date : Date,
    location : string,
    accuracy : number,
    timeElapsed : number,
    status : StatusTypes,
}

export enum StatusTypes {
    FAILED = "failed",
    SUCCESSFUL = "successful"
}