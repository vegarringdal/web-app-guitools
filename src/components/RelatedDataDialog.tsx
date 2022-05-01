import React, { useState } from "react";
import { getDataControllerByName } from "../utils/getDataControllerByName";
import { relatedDialogStateController } from "../state/relatedDialogStateController";
import { SimpleHtmlGrid } from "./SimpleHtmlGrid";
import { loadDataController } from "../utils/loadDataController";

/**
 * this is contrlled by dataController
 * datacontroller set datastate needed to open correct grid
 * @returns
 */
export function RelatedDataDialog() {
    const [reload, setReload] = useState(true);
    const dataState = relatedDialogStateController();

    if (!dataState.relatedDialogActivated) {
        return null;
    }

    const controllerName = dataState.parentViewApi;
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
        return (
            <div className="top-0 fixed grid w-full h-full items-center justify-center fadeIn z-[6001] bg-gray-50/50 fadeIn">
                <div className="relative block relatedGrid bg-gray-100 dark:bg-gray-800 flex flex-col">
                    <span className="w-full block bg-gray-300 p-1 text-center text-base dark:bg-gray-700 dark:text-white mb-1">
                        {dataState.parentTitle}
                    </span>

                    <div className="flex flex-grow">
                        <SimpleHtmlGrid
                            className="simple-html-grid flex-grow"
                            interface={gridInterface}
                        ></SimpleHtmlGrid>
                    </div>

                    <div className="bottom-2 left-0 right-0 flex mt-1 mb-1">
                        <div className="flex-1 bottom-2 left-0 right-0 flex"></div>

                        <button
                            className="block  bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold ml-1"
                            onClick={async () => {
                                const controller = getDataControllerByName(controllerName);
                                controller.service.loadAll({}, true);
                            }}
                        >
                            Reload
                        </button>
                        <button
                            className="block  bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold ml-1"
                            onClick={() => {
                                const entity = getDataControllerByName(dataState.parentViewApi).dataSource
                                    .currentEntity;
                                if (entity) {
                                    const dataState = relatedDialogStateController.getState();
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
                            className="block  bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold ml-1 mr-1"
                            onClick={() => dataState.deactivateRelatedDialog()}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
