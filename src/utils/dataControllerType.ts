import { DataContainer, Datasource } from "@simple-html/datasource";
import { GridInterface } from "@simple-html/grid";


export type dataControllerType = {
    dataContainer: DataContainer;
    dataSource: Datasource<any>;
    gridInterface: GridInterface<any>;
};
