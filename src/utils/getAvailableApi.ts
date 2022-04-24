import { getDataControllerByName } from "./getDataControllerByName";
import { guiStateController } from "../state/guiStateController";
import { setApiConfig } from "./apiConfig";
import { httpApiConfig } from "./httpApiConfig";
import { getAvailableApiCallbackType } from "./getAvailableApiCallbackType";

export async function getAvailableApi(
    useDataControllerName: string,
    addToMainDataController: boolean,
    callback: getAvailableApiCallbackType
) {
    const dataController = getDataControllerByName(useDataControllerName);
    dataController.dataSource.setData([]);

    callback({
        type: "info",
        header: "Connecting to server",
        content: null
    });

    const response = await fetch(httpApiConfig.all_url, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: null
    });

    // if error show this
    if (!response.ok || !response.body) {
        callback({
            type: "error",
            header: "Fetch error",
            content: response.statusText
        });

        return;
    }

    const jsonData = await response.json();

    setApiConfig(useDataControllerName, jsonData);

    if (addToMainDataController && Array.isArray(jsonData?.paths)) {
        dataController.gridInterface.loadSettings({
            cellHeight: 20,
            panelHeight: 25,
            footerHeight: 40,
            readonly: true,
            selectionMode: "single",
            groups: [
                {
                    width: 300,
                    rows: [
                        {
                            header: "URL_PATH",
                            attribute: "path",
                            readonly: true,
                            type: "text",
                            filterable: {},

                            sortable: {},
                            allowGrouping: true
                        }
                    ]
                },
                {
                    width: 500,
                    rows: [
                        {
                            header: "DESCRIPTION",
                            attribute: "description",
                            readonly: true,
                            type: "text",
                            filterable: {},

                            sortable: {},
                            allowGrouping: true
                        }
                    ]
                }
            ]
        });
        dataController.dataSource.setData(jsonData.paths);
    }

    setTimeout(() => {
        callback({
            type: "done",
            header: null,
            content: null
        });
    }, 100);

    callback({
        type: "info",
        header: "Loading data",
        content: "Updating grid, please wait"
    });

    guiStateController.setState({ currentUser: jsonData?.user?.userName || "unknown" });
}
