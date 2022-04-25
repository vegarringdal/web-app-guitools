import { apiType, setApiConfig } from "./apiConfig";
import { dataControllerMap } from "./dataControllerMap";
import { dataControllerType } from "./dataControllerType";
import { getApiInfo } from "./getApiInfo";
import { getApiInfoCallback } from "./getApiInfoCallback";
import { DataContainer, Datasource } from "@simple-html/datasource";
import { GridInterface } from "@simple-html/grid";
import type { GridConfig } from "@simple-html/grid/dist/types";
import { Service } from "./service";

export async function loadDataController(apiName: string) {
    const metadata: apiType = await getApiInfo(apiName, getApiInfoCallback);

    setApiConfig(apiName, metadata);
    const dataContainer = new DataContainer();
    const dataSource = new Datasource(dataContainer);
    const service = new Service(apiName);

    const columns = metadata.api.columns || [];
    const colConfig = columns.map((col) => {
        return {
            width: 100,
            rows: [
                {
                    header: col.label || col.name,
                    attribute: col.name,
                    readonly: metadata.apiRoles.UPDATABLE_COLUMNS.includes(col.name),
                    filterable: {},
                    sortable: {},
                    type: col.type
                }
            ]
        };
    });

    const defaultGrid: GridConfig = {
        cellHeight: 20,
        panelHeight: 25,
        footerHeight: 35,
        readonly: true,
        selectionMode: "multiple",
        groups: colConfig as any
    };

    const gridInterface = new GridInterface(defaultGrid, dataSource);

    dataControllerMap.set(apiName, {
        service,
        dataContainer,
        dataSource,
        gridInterface
    });
}
