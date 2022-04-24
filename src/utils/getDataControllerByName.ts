import { dataControllerMap } from "./dataControllerMap";
import { dataControllerType } from "./dataControllerType";

export function getDataControllerByName(name: string) {
    if (!dataControllerMap.has(name)) {
        console.error("missing controller", name);
        return {} as dataControllerType; // hack
    } else {
        return dataControllerMap.get(name) as dataControllerType;
    }
}
