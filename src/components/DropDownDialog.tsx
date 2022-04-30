import React, { useState } from "react";
import { getDataControllerByName } from "../utils/getDataControllerByName";
import { dataStateController } from "../state/dataStateController";
import { SimpleHtmlGrid } from "./SimpleHtmlGrid";
import { loadDataController } from "../utils/loadDataController";

/**WORK IN PROGRESS... */

/**
 * this is contrlled by dataController
 * datacontroller set datastate needed to open correct grid
 * @returns
 */
export function DropDownDialog() {
    const [reload, setReload] = useState(true);
    const dataState = dataStateController();

    // disable for now
    return null;

    if (!dataState.relatedDialogActivated && 1 === 1) {
        return null;
    }

    const style = {
        top: 50,
        left: 50,
        width: 300,
        height: 500
    };

    const controllerName = "WEB_USER"; // dataState.parentViewApi;
    const controller = getDataControllerByName(controllerName);
    if (!controller.gridInterface) {
        setTimeout(() => {
            loadDataController(controllerName).then(() => {
                setReload(reload ? false : true);
            });
        });
        return null;
    } else {
        const gridInterface = controller.gridInterface;
        gridInterface.config.footerHeight = 0;
        gridInterface.config.panelHeight = 0;
        return (
            <div
                style={style}
                className="absolute block bg-gray-100 dark:bg-gray-800 z-[6000] shadow-2xl border border-gray-900 flex flex-col"
            >
                <div className="flex flex-grow">
                    <SimpleHtmlGrid className="simple-html-grid flex-grow" interface={gridInterface}></SimpleHtmlGrid>
                </div>

                <div className="flex">
                    <button
                        className="block m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={() => {
                            const entity = getDataControllerByName(dataState.parentViewApi).dataSource.currentEntity;
                            if (entity) {
                                const dataState = dataStateController.getState();
                                const mainDataController = getDataControllerByName(dataState.controllerName);
                                const mainEntity = mainDataController.dataSource.currentEntity;
                                mainEntity[dataState.parentTo] = entity[dataState.parentFrom];
                                dataState.parentColumnsFromTo?.forEach(([from, to]) => {
                                    if (from && to) {
                                        mainEntity[to] = entity[from];
                                    }
                                });
                                mainDataController.gridInterface.updateRowCells();
                                dataState.deactivateRelatedDialog();
                            } else {
                            }
                        }}
                    >
                        Select
                    </button>

                    <button
                        className="block m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={async () => {
                            const controller = getDataControllerByName(controllerName);
                            controller.service.loadAll({}, true);
                        }}
                    >
                        Reload
                    </button>
                    <button
                        className="block m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={() => dataState.deactivateRelatedDialog()}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }
}
