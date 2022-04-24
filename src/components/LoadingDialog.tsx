import React from "react";
import { serviceStateController } from "../state/serviceStateController";

/**
 * Simple loading dialog controlled by serviceStateController
 * @returns
 */
export function LoadingDialog() {
    const serviceState = serviceStateController();

    // if service rest api is active, we still want to keep it open
    if (!serviceState.loadingDataDialogActived) {
        return null;
    }

    return (
        <div className="fixed grid w-full h-full items-center justify-center fadeIn z-[5010] bg-gray-50/50">
            <div className="block w-96 h-80 bg-gray-100 dark:bg-gray-800">
                <span className="m-auto block text-center text-2xl bg-gray-300 p-2 dark:bg-gray-700 dark:text-white">
                    Please wait
                </span>
                <div className="block m-2 mt-10">
                    <span className="m-auto block text-center loader dark:text-white"></span>
                </div>
                <span className="m-auto block text-center underline font-semibold dark:text-white">
                    {serviceState.loadingDataDialogHeader}
                </span>
                <span className="m-auto block text-center mt-4 whitespace-pre-line dark:text-white">
                    {serviceState.loadingDataDialogContent || ""}
                </span>
            </div>
        </div>
    );
}
