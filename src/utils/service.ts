import { fetchStreamData } from "./fetchStreamData";
import { DataTypes, FilterArgument } from "@simple-html/datasource";
import { generateGridConfig } from "./generateGridConfig";
import { getDataControllerByName } from "./getDataControllerByName";
import { restApiCallEnd, restApiCallStart } from "./restApiCalls";
import { serviceCallback } from "./serviceCallback";
import { ServiceCallbackType } from "./ServiceCallbackType";
import { httpApiConfig } from "./httpApiConfig";
import { getApiConfig } from "./apiConfig";
import { reSelectCurrentEntityAndRefreshDs } from "./reSelectCurrentEntity";

export class Service {
    callbackFn: ServiceCallbackType;
    dataControllerName: string;
    lastRequest: any;

    constructor(dataControllerName: string, callbackFn: ServiceCallbackType = serviceCallback) {
        this.dataControllerName = dataControllerName;
        this.lastRequest = null as any;
        this.callbackFn = callbackFn;
    }

    private generateQueryUrlParams(queryUrl: string, metaDataOnly: boolean) {
        const urlParams = new URLSearchParams();
        urlParams.append("rows", "0");

        if (metaDataOnly) {
            urlParams.append("meta", "1");
        }

        return `${queryUrl}?${urlParams.toString()}`;
    }

    private resetServiceState() {
        this.callbackFn({
            type: "info",
            header: "Connecting to database",
            content: "Updating grid, please wait",
            loadingDataRuntimeMilliseconds: 0,
            loadingDataReplyMilliseconds: 0,
            loadingDataRowCount: 0
        });
    }

    public getLastRequestTimestamp() {
        return new Date(this.lastRequest);
    }

    fetchCallStart() {
        restApiCallStart();
    }

    fetchCallEnd() {
        restApiCallEnd();
    }

    async loadAll(query?: FilterArgument, metaDataOnly = false) {
        this.fetchCallStart();
        this.resetServiceState();
        const controller = getDataControllerByName(this.dataControllerName);
        const apiName = getApiConfig(this.dataControllerName).api.apiName;
        controller.dataSource.setData([]);

        const error = await this.fetchData(
            this.generateQueryUrlParams(httpApiConfig.query_url + apiName, metaDataOnly),
            query
        );

        if (!error) {
            controller.dataSource.reloadDatasource();
            controller.dataSource.__callSubscribers("collection-sorted");
        }

        this.fetchCallEnd();
        if (!error) {
            this.callbackFn({
                type: "done",
                header: null,
                content: null
            });
        }
    }

    reloadData() {
        // todo
    }

    private async fetchData(
        urlPathAndParams: string,
        query: FilterArgument | null | undefined,
        primaryKeys: string[] = [],
        updateOnly = false
    ) {
        const v0 = performance.now();
        const controller = getDataControllerByName(this.dataControllerName);
        const primaryKey = getApiConfig(this.dataControllerName).api.primaryKey;

        let fetchError = false;
        this.lastRequest = new Date();

        await fetchStreamData(urlPathAndParams, query, (res) => {
            if (res.type === "data") {
                const dataContainer = controller.dataContainer;
                if (!updateOnly && !primaryKey) {
                    dataContainer.setData([res.data], true);
                } else {
                    const index = primaryKeys.indexOf(res.data[primaryKey]);
                    if (index !== -1) {
                        dataContainer.replace([res.data], index, 1);
                    } else {
                        dataContainer.setData([res.data], true);
                    }
                }
            }

            if (res.type === "length") {
                this.callbackFn({
                    type: "info",
                    header: "Downloading data",
                    content: `Rows fetch: ${res.data}\nTime used: ${
                        (performance.now() - v0).toString().split(".")[0]
                    }ms`,
                    loadingDataRowCount: res.data
                });
            }

            /*  if (res.type === "meta") {
                generateGridConfig(res.data as any, true, this.dataControllerName);
            } */

            if (res.type === "error") {
                fetchError = true;
                this.callbackFn({
                    type: "error",
                    header: "Fetch error",
                    content: res.data
                });
            }
        });

        return fetchError;
    }
}
