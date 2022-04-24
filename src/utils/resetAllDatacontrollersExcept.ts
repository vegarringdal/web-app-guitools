import { dataControllerMap } from "./dataControllerMap";

export function resetAllDatacontrollersExcept(controllerNameToSkip: string) {
    const list = Array.from(dataControllerMap);
    list.forEach(([key]) => {
        if (key !== controllerNameToSkip) {
            dataControllerMap.delete(key);
        }
    });
}
