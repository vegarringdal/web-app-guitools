import { guiStateController } from "../state/guiStateController";
import { getApiInfoCallbackType } from "./getApiInfoCallbackType";
import { getAccessToken } from "./getAzureAuth";
import { httpApiConfig } from "./httpApiConfig";

export async function getApiInfo(apiName: string, callback: getApiInfoCallbackType) {
    callback({
        type: "info",
        header: "Gettign Api metadata",
        content: null
    });

    const response = await fetch(httpApiConfig.info_url + apiName, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await getAccessToken())
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

    const jsonMetadata = await response.json();

    setTimeout(() => {
        callback({
            type: "done",
            header: null,
            content: null
        });
    }, 100);

    guiStateController.setState({ currentUser: jsonMetadata?.user?.userName || "unknown" });

    return jsonMetadata;
}
