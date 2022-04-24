import { dataControllerMap, dataControllerType } from "./dataControllerMap";

/**
 * Get controller by name
 * @param name
 * @returns
 */
export function getDataControllerByName(name: string) {
    if (!dataControllerMap.has(name)) {
        console.error("missing dynstate", name);
        return {} as dataControllerType; // hack
    } else {
        return dataControllerMap.get(name) as dataControllerType;
    }
}
