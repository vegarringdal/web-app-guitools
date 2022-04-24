import { ApiInterface } from "@rad-common";
import { setService } from "./serviceMap";

// callback type/events
export type serviceCallbackEvents = {
    type: "done" | "info" | "error";
    content: string | null;
    header: string | null;
    loadingDataRuntimeMilliseconds?: number | null;
    loadingDataReplyMilliseconds?: number | null;
    loadingDataRowCount?: number | null;
};
export type ServiceCallbackType = (event: serviceCallbackEvents) => void;


/**
 * static enpoint between client/server
 * split into functions, might be easier to use/overview,
 * TODO: try and trim down...getting to large
 */
export class Service {
    private apiQuery: string;
    private apiUpdate: string;
    private viewConfig: ApiInterface;
    private lastRequest: Date;
    private projectCode: string | null;
    private dataControllerName: string;
    private userRoles: any;
    callbackFn: ServiceCallbackType;

    constructor(
        dataControllerName: string,
        apiQuery: string,
        apiUpdate: string,
        tableConfig: ApiInterface,
        userRoles: any,
        projectCode: string | null,
        callbackFn: ServiceCallbackType
    ) {
        this.userRoles = userRoles;
        this.dataControllerName = dataControllerName;
        this.apiQuery = apiQuery;
        this.apiUpdate = apiUpdate;
        this.viewConfig = tableConfig;
        this.projectCode = projectCode;
        this.lastRequest = null as any;
        this.callbackFn = callbackFn;
        setService(dataControllerName, this);
    }
}
