import { GridInterface } from "@simple-html/grid";

export function markForDeletion(gridInterface: GridInterface) {
    const currentDataSet = gridInterface.getDatasource().getRows(true);
    const selectedRowNumbers = gridInterface.getSelectedRows();
    const selectedData: any[] = [];
    selectedRowNumbers.forEach((rowNo: any) => {
        selectedData.push(currentDataSet[rowNo]);
    });

    gridInterface.getDatasource().markForDeletion(selectedData);
}
