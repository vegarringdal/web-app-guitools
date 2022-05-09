import React from "react";
import { getDataControllerByName } from "../utils/getDataControllerByName";
import { guiStateController } from "../state/guiStateController";
import { disableStyle } from "../utils/disableStyle";
import { getApiConfig } from "../utils/apiConfig";
import { UserRolesInterface } from "@rad-common";
import { serviceStateController } from "../state/serviceStateController";
import { gridControllerButtonActions } from "../utils/gridControllerButtonActions";

/**
 * all controller buttons on grid left side
 * ended up beeing crazy big function
 */
export function GridControllerButtons(props: { dataSet: string }) {
    const guiState = guiStateController();
    const serviceState = serviceStateController();
    const roles = getApiConfig(props.dataSet)?.apiRoles || ({} as UserRolesInterface);

    /**
     * helper functions for settig correct state on buttons
     */
    function hiddenStyleOrDisabled(name: navCompactionEvents) {
        // TODO, will add to props option to disable buttons not needed, and maybe add more?
        const hidden = ""; //!hiddenButtons.includes(name) ? "" : "hidden";
        const disabled = name; // !disabledButtons.includes(name) ? "" : "opacity-30 pointer-events-none";

        return ` ${hidden} ${disabled} `;
    }

    function datasourceSize() {
        const ds = getDataControllerByName(props.dataSet).dataSource;
        return ds?.length() || 0;
    }

    function disableIfLoadingOrNoData(skipRule?: boolean) {
        if (skipRule === true) {
            return !skipRule;
        }
        return serviceState.loadingDataDialogActived || datasourceSize() < 1;
    }

    function disableIfNotEditMode() {
        return serviceState.loadingDataDialogActived || !guiState.editMode;
    }

    function redCssStyle() {
        return !disableIfNotEditMode()
            ? " bg-red-500  hover:bg-red-600 dark:bg-red-700  dark:hover:bg-red-600 dark:text-white "
            : " bg-gray-200 hover:bg-gray-300 dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 ";
    }

    function greenCssStyle() {
        return !disableIfNotEditMode()
            ? "bg-green-500 hover:bg-green-500 dark:bg-green-700  dark:hover:bg-green-600 dark:text-white "
            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 ";
    }

    function disableIfLoadingOrMainPage() {
        return serviceState.loadingDataDialogActived;
    }

    /**
     * render
     */

    return (
        <>
            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("getAll") +
                    disableStyle(disableIfLoadingOrMainPage())
                }
                disabled={disableIfLoadingOrMainPage()}
                onClick={() => gridControllerButtonActions("getAll", props.dataSet)}
            >
                Get All
            </button>

            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("getWithFilter") +
                    disableStyle(disableIfLoadingOrMainPage())
                }
                disabled={disableIfLoadingOrMainPage()}
                onClick={() => gridControllerButtonActions("getWithFilter", props.dataSet)}
            >
                Get With Filter
            </button>

            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("refresh") +
                    disableStyle(disableIfLoadingOrMainPage())
                }
                disabled={disableIfLoadingOrMainPage()}
                onClick={() => gridControllerButtonActions("refresh", props.dataSet)}
            >
                Refresh
            </button>

            <hr className="mt-2 mb-2 dark:border-gray-600"></hr>

            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("excel") +
                    disableStyle(disableIfLoadingOrMainPage())
                }
                disabled={disableIfLoadingOrMainPage()}
                onClick={() => gridControllerButtonActions("excel", props.dataSet)}
            >
                Excel
            </button>

            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("gridConfig") +
                    disableStyle(disableIfLoadingOrMainPage())
                }
                disabled={disableIfLoadingOrMainPage()}
                onClick={() => gridControllerButtonActions("gridConfig", props.dataSet)}
            >
                GridConfig
            </button>

            <hr className="mt-2 mb-2 dark:border-gray-600"></hr>

            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("first") +
                    disableStyle(disableIfLoadingOrNoData())
                }
                disabled={disableIfLoadingOrNoData()}
                onClick={() => gridControllerButtonActions("first", props.dataSet)}
            >
                First
            </button>

            <button
                className={
                    "m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("next") +
                    disableStyle(disableIfLoadingOrNoData())
                }
                disabled={disableIfLoadingOrNoData()}
                onClick={() => gridControllerButtonActions("next", props.dataSet)}
            >
                Next
            </button>

            <button
                className={
                    " m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("prev") +
                    disableStyle(disableIfLoadingOrNoData())
                }
                disabled={disableIfLoadingOrNoData()}
                onClick={() => gridControllerButtonActions("prev", props.dataSet)}
            >
                Prev
            </button>

            <button
                className={
                    " m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("last") +
                    disableStyle(disableIfLoadingOrNoData())
                }
                disabled={disableIfLoadingOrNoData()}
                onClick={() => gridControllerButtonActions("last", props.dataSet)}
            >
                Last
            </button>

            <hr className="mt-2 mb-2 dark:border-gray-600"></hr>

            <button
                className={
                    "mt-2 m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none  dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("edit") +
                    disableStyle(disableIfLoadingOrNoData(roles.UPDATE) || !roles.UPDATE)
                }
                disabled={disableIfLoadingOrNoData(roles.UPDATE) || !roles.UPDATE}
                onClick={() => gridControllerButtonActions("edit", props.dataSet)}
            >
                Edit
            </button>

            <button
                className={
                    greenCssStyle() +
                    "mt-2 m-1 p-1 w-28 focus:outline-none   font-semibold" +
                    hiddenStyleOrDisabled("cancel") +
                    disableStyle(disableIfNotEditMode())
                }
                disabled={disableIfNotEditMode()}
                onClick={() => gridControllerButtonActions("cancel", props.dataSet)}
            >
                Cancel
            </button>

            <hr className="mt-2 mb-2 dark:border-gray-600"></hr>

            <button
                className={
                    "mt-2 m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("new") +
                    disableStyle(disableIfNotEditMode() || !roles.INSERT)
                }
                disabled={disableIfNotEditMode() || !roles.INSERT}
                onClick={() => gridControllerButtonActions("new", props.dataSet)}
            >
                New
            </button>
            <button
                className={
                    "mt-2 m-1 p-1 bg-gray-200 w-28  hover:bg-gray-300 focus:outline-none dark:bg-gray-700  dark:hover:bg-gray-600 dark:text-blue-400 font-semibold" +
                    hiddenStyleOrDisabled("copy") +
                    disableStyle(disableIfNotEditMode() || !roles.INSERT)
                }
                disabled={disableIfNotEditMode() || !roles.INSERT}
                onClick={() => gridControllerButtonActions("copy", props.dataSet)}
            >
                Copy Row
            </button>

            <hr className="mt-2 mb-2 dark:border-gray-600"></hr>

            <button
                className={
                    redCssStyle() +
                    "mt-2 m-1 p-1  w-28  focus:outline-none  font-semibold" +
                    hiddenStyleOrDisabled("edit") +
                    disableStyle(disableIfNotEditMode() || !roles.DELETE)
                }
                disabled={disableIfNotEditMode() || !roles.DELETE}
                onClick={() => gridControllerButtonActions("delete", props.dataSet)}
            >
                Delete
            </button>

            <button
                className={
                    redCssStyle() +
                    "mt-2 m-1 p-1 w-28  focus:outline-none   font-semibold" +
                    hiddenStyleOrDisabled("edit") +
                    disableStyle(disableIfNotEditMode() || !roles.UPDATE)
                }
                disabled={disableIfNotEditMode() || !roles.UPDATE}
                onClick={() => gridControllerButtonActions("save", props.dataSet)}
            >
                Save
            </button>
        </>
    );
}

export type navCompactionEvents =
    | "back"
    | "first"
    | "prev"
    | "next"
    | "last"
    | "save"
    | "edit"
    | "new"
    | "cancel"
    | "delete"
    | "refresh"
    | "getAll"
    | "excel"
    | "gridConfig"
    | "copy"
    | "getWithFilter";
