import { IMediaTypes } from "src/types/@types"

export type PlateTrackingLogsDto = {
    plateLogId : string,
    date : Date,
    locations : string[],
    S3Key:string
}

export enum StatusTypes {
    FAILED = "failed",
    SUCCESSFUL = "successful"
}