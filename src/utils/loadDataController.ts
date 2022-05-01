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
import { relatedDialogStateController } from "../state/relatedDialogStateController";
import { ApiColumn } from "../../../rad-common/src/utils/ApiInterface";

export async function loadDataController(apiName: string) {
    const metadata: apiType = await getApiInfo(apiName, getApiInfoCallback);
    setApiConfig(apiName, metadata);

    const cols: Record<string, ApiColumn> = {};
    metadata.api.columns.forEach((col) => {
        cols[col.name] = col;
    });

    const EntityHandlerOverride = class extends EntityHandler {
        get(target: any, prop: string) {
            switch (true) {
                case cols[prop]?.isCheckbox:
                    return target[prop] === cols[prop].checkboxChecked ? true : false;
                    break;
                default:
                    return super.get(target, prop);
            }
        }
        set(obj: any, prop: string, value: any) {
            switch (true) {
                case cols[prop]?.isCheckbox:
                    return super.set(
                        obj,
                        prop,
                        value === "true" || value === true || value === cols[prop].checkboxChecked
                            ? cols[prop].checkboxChecked
                            : cols[prop].checkboxUnchecked
                    );
                    break;
                default:
                    return super.set(obj, prop, value);
            }
        }
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
                    type: col.isCheckbox ? "boolean" : col.type,
                    focusButton: col.parentViewApi !== undefined,
                    stopManualEdit: col.parentViewApi !== undefined,
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
        lastCopyEvent: null as any,
        handleEvent: function (event: any) {
            if (event.type === "focus-button") {
                const dataState = relatedDialogStateController.getState();
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
            }

            if (event.type === "copy-cell") {
                const attribute = event?.data?.cell?.attribute || "-------------";
                const rowData = event?.data?.rowData[attribute];
                if (rowData) {
                    const rowData = event?.data?.rowData;
                    const data: any = {};
                    const keys = metadata.api.columns.map((e) => e.name);
                    keys.forEach((key) => {
                        data[key] = rowData[key];
                    });
                    this.lastCopyEvent = {
                        data,
                        attribute
                    };
                }
            }

            if (event.type === "paste-into-selected-rows-in-selected-column") {
                const attribute = event?.data?.cell?.attribute || "-------------";

                if (this.lastCopyEvent && this.lastCopyEvent.attribute === attribute) {
                    const apiColumns = getApiConfig(this.controllerName).api.columns;
                    const col = apiColumns.filter((x) => {
                        return x.name === attribute;
                    })?.[0];

                    // we need to update linked, but just the "too"
                    col.parentColumnsFromTo?.forEach(([_, column]) => {
                        const valueToUse = this.lastCopyEvent.data[column];
                        const selectedRows = gridInterface.getSelectedRows();
                        const rows = gridInterface.getDatasource().getRows();
                        selectedRows.forEach((rowNo: number) => {
                            if (rows[rowNo]) {
                                rows[rowNo][column] = valueToUse;
                            }
                        });
                    });
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
