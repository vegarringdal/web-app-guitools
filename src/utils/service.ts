import { ApiInterface } from "@rad-common";
import { ServiceCallbackType } from "./ServiceCallbackType";
import { setService } from "./serviceMap";

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
