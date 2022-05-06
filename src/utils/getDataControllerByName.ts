import { dataControllerMap } from "./dataControllerMap";
import { dataControllerType } from "./dataControllerType";

export function getDataControllerByName(name: string) {
    if (!dataControllerMap.has(name)) {
        return {} as dataControllerType;
    } else {
        return dataControllerMap.get(name) as dataControllerType;
    }
}
