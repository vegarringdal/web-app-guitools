import { serviceCallback } from "./serviceCallback";
import { ServiceCallbackType } from "./ServiceCallbackType";

export class Service {
    callbackFn: ServiceCallbackType;
    dataControllerName: string;
    lastRequest: any;

    constructor(dataControllerName: string, callbackFn: ServiceCallbackType = serviceCallback) {
        this.dataControllerName = dataControllerName;
        this.lastRequest = null as any;
        this.callbackFn = callbackFn;
    }
}
