import { guiStateController } from "../state/guiStateController";
import { httpApiConfig } from "../utils/httpApiConfig";
import { serviceStateController } from "../state/serviceStateController";
import { getAzureAuth } from "../utils/getAzureAuth";

/**
 * check if we are logged in before displaying main content
 * TODO: I need to set gui/service controller as callback, incase someone have own dialog, dont want to use default
 * @param props
 * @returns
 */
export function AuthLoader(props: { children: any }) {
    const guiState = guiStateController();

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
                try {
                    const token = await getAzureAuth();
                    guiStateController.setState({
                        isAuthenticationChecked: true,
                        currentUser: token.account?.name || "na",
                        allUserRoles: (token.account?.idTokenClaims as any)?.roles || []
                    });
                } catch (err) {
                    serviceStateController.setState({
                        loadingDataDialogActived: false,
                        errorDialogActivated: true,
                        errorDialogHeader: "Fetch error",
                        errorDialogContent: err as any
                    });
                }

                serviceStateController.getState().deactivateLoadingData();
            }

            load();
        }
    } else {
        return props.children;
    }

    return null;
}
