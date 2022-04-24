import React from "react";
import { getDataControllerByName } from "../utils/getDataControllerByName";
import { dataStateController } from "../state/dataStateController";
import { getService } from "../utils/serviceMap";
import { SimpleHtmlGrid } from "./SimpleHtmlGrid";
import { getApiConfig } from "../utils/apiConfig";

/**
 * this is contrlled by dataController
 * datacontroller set datastate needed to open correct grid
 * @returns
 */
export function RelatedDataDialog() {
    const dataState = dataStateController();

    if (!dataState.relatedDialogActivated) {
        return null;
    }

    return (
        <div className="fixed grid w-full h-full items-center justify-center fadeIn z-[5001] bg-gray-50/50 fadeIn">
            <div className="relative block relatedGrid bg-gray-100 dark:bg-gray-800">
                <span className="m-auto block text-center text-2xl bg-gray-300 p-2 dark:bg-gray-700 dark:text-white">
                    {"Select"}
                </span>

                <div className="absolute top-10 right-0 left-0 bottom-10 mt-2">
                    <div className="flex h-full">
                        <SimpleHtmlGrid
                            className="simple-html-grid flex-grow m-3 mb-5"
                            interface={getDataControllerByName(dataState.relatedData).gridInterface}
                        ></SimpleHtmlGrid>
                    </div>
                </div>

                <div className="absolute bottom-2 left-0 right-0 flex">
                    <button
                        className="block m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={() => {
                            const entity = getDataControllerByName(dataState.relatedData).dataSource.currentEntity;
                            if (entity) {
                                const dataState = dataStateController.getState();
                                const mainDataController = getDataControllerByName(dataState.mainDataControllerName);
                                const mainEntity = mainDataController.dataSource.currentEntity;
                                mainEntity[dataState.relationColumn] = entity[dataState.insertFromColumn];
                                mainDataController.gridInterface.updateRowCells();
                                dataState.deactivateRelatedDialog();
                            } else {
                                alert("no row selected");
                            }
                        }}
                    >
                        Select
                    </button>

                    <button
                        className="block m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={async () => {
                            // this basicly just load the headers.. do not want to load data, user might want to define filter
                            alert("not implemented");
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
        </div>
    );
}
