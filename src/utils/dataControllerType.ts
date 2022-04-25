import { DataContainer, Datasource } from "@simple-html/datasource";
import { GridInterface } from "@simple-html/grid";
import { Service } from "./service";


export type dataControllerType = {
    dataContainer: DataContainer;
    dataSource: Datasource<any>;
    gridInterface: GridInterface<any>;
    service: Service;
};

