export type IGetTrackingDataParams = {
    FaceId : string,
    Timestamp? : string
}

export type ISearchFaceByImageParams = {
    base64Image : string
}

export type ISearchByTextQueryParams = { 
    name : string,
    alias : string,
    startTime : Date,
    endTime : Date
}