import { StatusTypes, MediaTypes } from "@prisma/client";

export interface Filters {
    startDate?: Date;
    endDate?: Date;
    status?: StatusTypes;
    type?: MediaTypes;
    page? : number,
    pageSize? : number
}