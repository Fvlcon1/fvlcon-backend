import { IMediaTypes } from "src/types/@types"

export type PersonTrackingLogsDto = {
    personLogId : string,
    date : Date,
    locations : string[],
}

export enum StatusTypes {
    FAILED = "failed",
    SUCCESSFUL = "successful"
}