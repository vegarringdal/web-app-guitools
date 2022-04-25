import { dataControllerMap } from "./dataControllerMap";
import { dataControllerType } from "./dataControllerType";
import { DataContainer, Datasource } from "@simple-html/datasource";
import { GridInterface } from "@simple-html/grid";

export function getDataControllerByName(name: string) {
    if (!dataControllerMap.has(name)) {
        return {} as dataControllerType;
    } else {
        return dataControllerMap.get(name) as dataControllerType;
    }
}
