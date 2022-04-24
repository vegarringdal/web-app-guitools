import { getDataControllerByName } from "./getDataControllerByName";
import { guiStateController } from "../state/guiStateController";
import { setApiConfig } from "./apiConfig";
import { httpApiConfig } from "./httpApiConfig";
import { getAvailableApiCallbackType } from "./getAvailableApiCallbackType";

export async function getAvailableApi(callback: getAvailableApiCallbackType) {
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
    if (Array.isArray(jsonData.paths)) {
        callback({
            type: "info",
            header: "Loading data",
            content: "Getting api available"
        });

        for (let i = 0; i < jsonData.paths.length; i++) {
            const response = await fetch(httpApiConfig.info_url + jsonData.paths[i].path, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: null
            });
            if (response.ok) {
                const jsonData = await response.json();
                setApiConfig(jsonData.api.apiName, jsonData);
            }
        }
    }

    setTimeout(() => {
        callback({
            type: "done",
            header: null,
            content: null
        });
    }, 100);

    guiStateController.setState({ currentUser: jsonData?.user?.userName || "unknown" });
}
