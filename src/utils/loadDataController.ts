import { apiType, getApiConfig, setApiConfig } from "./apiConfig";
import { dataControllerMap } from "./dataControllerMap";
import { dataControllerType } from "./dataControllerType";
import { getApiInfo } from "./getApiInfo";
import { getApiInfoCallback } from "./getApiInfoCallback";
import { DataContainer, Datasource, EntityHandler } from "@simple-html/datasource";
import { GridGroupConfig } from "@simple-html/grid/dist/types";
import { GridInterface } from "@simple-html/grid";
import type { GridConfig } from "@simple-html/grid/dist/types";
import { Service } from "./service";
import { dataStateController } from "../state/dataStateController";

export async function loadDataController(apiName: string) {
    const metadata: apiType = await getApiInfo(apiName, getApiInfoCallback);
    console.log(metadata.api);
    setApiConfig(apiName, metadata);

    const EntityHandlerOverride = class extends EntityHandler {
        
    };

    const dataContainer = new DataContainer(metadata.api.primaryKey);
    dataContainer.overrideEntityHandler(EntityHandlerOverride);
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
                    readonly: !metadata.apiRoles.UPDATABLE_COLUMNS.includes(col.name),
                    filterable: {},
                    sortable: {},
                    type: col.isCheckbox ? 'boolean' : col.type,
                    focusButton: col.parentViewApi !== undefined,
                    focusButtonIfCellReadonly: true,
                    focusButtonIfGridReadonly: false
                }
            ]
        } as GridGroupConfig;
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

    const eventHandler = {
        controllerName: apiName,
        handleEvent: function (event: any) {
            const dataState = dataStateController.getState();
            const attribute = event?.data?.cell?.attribute;

            if (attribute && this.controllerName) {
                const columns = getApiConfig(this.controllerName).api.columns;
                const col = columns.filter((x) => {
                    return x.name === attribute;
                })?.[0];

                if (col && col.parentViewApi) {
                    dataState.activateRelatedDialog(
                        this.controllerName,
                        col.parentTitle as string,
                        col.parentViewApi as string,
                        col.parentFrom as string,
                        col.parentTo as string,
                        col.parentColumnsFromTo as string[][]
                    );
                }
            }

            return true;
        }
    };

    gridInterface.addEventListener(eventHandler);

    dataControllerMap.set(apiName, {
        service,
        dataContainer,
        dataSource,
        gridInterface
    });
}
