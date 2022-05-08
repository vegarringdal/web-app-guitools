import React, { useState, useEffect, useRef } from "react";
import { getDataControllerByName } from "../utils/getDataControllerByName";
import { dropdownDialogStateController } from "../state/dropdownDialogStateController";
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
    const dataState = dropdownDialogStateController();

    const refElement = useRef(null);

    useEffect(() => {
        const element = refElement.current as any;
        if (element) {
            // this will keep it within screen, but maybe I should move bottom top of input when it does not fix under?
            const rect = element.getBoundingClientRect();
            const thisInnerHeight = window.innerHeight;
            const thisInnerWidth = window.innerWidth;
            if (rect.bottom > thisInnerHeight) {
                dropdownDialogStateController.setState({ top: element.offsetTop - (rect.bottom - thisInnerHeight) });
            }
            if (rect.right > thisInnerWidth) {
                dropdownDialogStateController.setState({ left: element.offsetLeft - (rect.right - thisInnerWidth) });
            }
        }
    });

    function resizeHandler(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const x = event.clientX;
        const y = event.clientY;
        function moveHandler(e: any) {
            const resizeX = e.clientX - x;
            const resizeY = e.clientY - y;
            let height = dataState.height + resizeY;
            let width = dataState.width + resizeX;
            if (height < 100) {
                height = 100;
            }
            if (width < 200) {
                width = 200;
            }

            dropdownDialogStateController.setState({ height: height, width: width });
        }

        function upHandler() {
            window.removeEventListener("mouseup", upHandler);
            window.removeEventListener("mousemove", moveHandler);
        }

        window.addEventListener("mouseup", upHandler);
        window.addEventListener("mousemove", moveHandler);
    }

    if (!dataState.relatedDialogActivated) {
        return null;
    }

    const style = {
        top: dataState.top,
        left: dataState.left,
        width: dataState.width,
        height: dataState.height
    };

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
        gridInterface.config.footerHeight = 0;
        gridInterface.config.panelHeight = 0;
        return (
            <div
                ref={refElement}
                style={style}
                className="absolute flex bg-gray-100 dark:bg-gray-800 z-[6000] shadow-2xl border p-1 border-gray-900 flex-col"
            >
                <div className="flex flex-grow">
                    <SimpleHtmlGrid className="simple-html-grid flex-grow" interface={gridInterface}></SimpleHtmlGrid>
                </div>

                <div className="flex float">
                    <div className="flex-1"></div>
                    <button
                        className="block m-auto mt-1 bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={() => {
                            const entity = getDataControllerByName(dataState.parentViewApi).dataSource.currentEntity;
                            if (entity) {
                                const dataState = dropdownDialogStateController.getState();
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
                        className="block ml-1 mr-1 mt-1 bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={async () => {
                            const controller = getDataControllerByName(controllerName);
                            controller.service.loadAll({}, true);
                        }}
                    >
                        Reload
                    </button>
                    <button
                        className="block m-auto mt-1 bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={() => dataState.deactivateRelatedDialog()}
                    >
                        Close
                    </button>
                    <div
                        className="absolute p-1 z-50 bottom-0 right-0 cursor-nw-resize"
                        onMouseDown={resizeHandler}
                    ></div>
                </div>
            </div>
        );
    }
}
