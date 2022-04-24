import { guiStateController } from "../state/guiStateController";
import { httpApiConfig } from "../utils/httpApiConfig";
import { serviceStateController } from "../state/serviceStateController";

/**
 * check if we are logged in before displaying main content
 * TODO: I need to set gui/service controller as callback, incase someone have own dialog, dont want to use default
 * @param props
 * @returns
 */
export function AuthLoader(props: { children: any }) {
    const guiState = guiStateController();

    const hash = location.hash; // TODO, keep or just use hash on this?
    if (hash === "#redirected") {
        location.href = localStorage.getItem("app_url") || "";
    }

    if (!guiState.isCheckingAuthentication || !guiState.isAuthenticationChecked) {
        // check and return
        if (!guiState.isCheckingAuthentication) {
            guiStateController.setState({
                isCheckingAuthentication: true
            });
            serviceStateController.setState({
                loadingDataDialogActived: true,
                loadingDataDialogHeader: "checking authentication"
            });

            async function load() {
                localStorage.setItem("app_url", location.href);

                const url = `${httpApiConfig.login_url}`;
                const response = await fetch(url, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: null
                });

                // not authenticated
                if (response.status === 401) {
                    location.href = "/login";
                    return;
                }

                // ww for some reason get something else
                if (!response.ok) {
                    serviceStateController.setState({
                        loadingDataDialogActived: false,
                        errorDialogActivated: true,
                        errorDialogHeader: "Fetch error",
                        errorDialogContent: response.statusText
                    });

                    return;
                }
                const json = await response.json();
                serviceStateController.getState().deactivateLoadingData();
                guiStateController.setState({
                    isAuthenticationChecked: true,
                    currentUser: json.user.userName,
                    allUserRoles: json.allUserRoles
                });
            }

            load();
        }
    } else {
        return props.children;
    }

    return null;
}
