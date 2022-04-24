import { DataContainer, Datasource } from "@simple-html/datasource";
import { GridInterface } from "@simple-html/grid";

export type dataControllerType = {
    dataContainer: DataContainer;
    dataSource: Datasource<any>;
    gridInterface: GridInterface<any>;
    propsSet: Set<string>;
    configMap: Map<string, any>;
    relatedMap: Map<string, any>;
    linkedColumns: Map<string, string[]>;
};

// all datacontrollers created
export const dataControllerMap = new Map<string, dataControllerType>();
