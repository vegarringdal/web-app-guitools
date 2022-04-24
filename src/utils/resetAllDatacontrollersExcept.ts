import { dataControllerMap } from "./dataControllerMap";

/**
 * Helper for removing dynamicly created controllers except main
 */

export function resetAllDatacontrollersExcept(controllerNameToSkip: string) {
    const list = Array.from(dataControllerMap);
    list.forEach(([key]) => {
        if (key !== controllerNameToSkip) {
            dataControllerMap.delete(key);
        }
    });
}
