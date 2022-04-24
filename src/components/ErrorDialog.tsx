import React from "react";
import { serviceStateController } from "../state/serviceStateController";

/**
 * Simple error dialog, controlled by serviceStateController
 * @returns
 */
export function ErrorDialog() {
    const serviceState = serviceStateController();

    if (!serviceState.errorDialogActivated) {
        return null;
    }

    return (
        <div className="fixed grid w-full h-full items-center justify-center fadeIn z-[5010] bg-gray-50/50">
            <div className="relative block w-96 h-80 bg-gray-100 dark:bg-gray-800">
                <span className="m-auto block text-center text-2xl bg-gray-300 p-2 dark:bg-gray-700 dark:text-white">
                    Error
                </span>

                <span className="mt-2 m-auto block text-center underline font-semibold dark:text-white">
                    {serviceState.errorDialogHeader}
                </span>

                <span className="flex-1 m-auto block text-center mt-4 whitespace-pre-line dark:text-white">
                    {serviceState.errorDialogContent || "s"}
                </span>
                <div className="absolute bottom-2 left-0 right-0">
                    <button
                        className="block m-auto bg-gray-200 dark:bg-gray-700 p-2 w-36 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none dark:text-blue-400 font-semibold"
                        onClick={() => serviceState.deactivateErrorDialog()}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
