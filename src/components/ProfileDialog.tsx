import React from "react";
import { guiStateController } from "../state/guiStateController";
import { serviceStateController } from "../state/serviceStateController";
import { getAzureAuth } from "../utils/getAzureAuth";

/**
 * simple profile dialog, TODO: improve later
 * @returns
 */
export function ProfileDialog() {
    const guiState = guiStateController();
    const serviceState = serviceStateController();

    if (!guiState.isProfileDialogActivated) {
        return null;
    }

    return (
        <div className="fixed grid w-full h-full items-center justify-center fadeIn z-[2000] bg-gray-50/50">
            <div className="relative block w-96 h-80 bg-gray-100 dark:bg-gray-800">
                <span className="m-auto block text-center text-2xl bg-gray-300 p-2 dark:bg-gray-700 dark:text-white">
                    Profile
                </span>

                <span className="mt-2 m-auto block text-center underline font-semibold dark:text-white">
                    {guiState.currentUser}
                </span>

                <span className="flex-1 m-auto block text-center mt-4 whitespace-pre-line dark:text-white">
                    Roles:
                    {guiState?.allUserRoles?.map((name, i) => {
                        return <div key={i}>{name}</div>;
                    })}
                </span>
                <div className="absolute bottom-2 left-0 right-0">
                    <div className="flex w-full">
                        <button
                            className="m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                            onClick={() => guiState.deactivateProfileDialog()}
                        >
                            Close
                        </button>
                        <button
                            className="m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                            onClick={() => {
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
                                    setTimeout(() => {
                                        serviceStateController.getState().deactivateLoadingData();
                                    }, 1000);
                                   
                                }

                                load();
                            }}
                        >
                            Refresh Roles
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
