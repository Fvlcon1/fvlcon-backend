import { IMediaTypes } from "src/types/@types"

export type PlateTrackingLogsDto = {
    plateLogId : string,
    date : Date,
    locations : string[],
}

export enum StatusTypes {
    FAILED = "failed",
    SUCCESSFUL = "successful"
}