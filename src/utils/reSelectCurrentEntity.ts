import { Datasource } from "@simple-html/datasource";

/**
 * Helper to reslect current entity after refresh
 * this will trigger current enity callback witch is useful
 * @param ds
 * @param primaryKey
 */
export function reSelectCurrentEntityAndRefreshDs(ds: Datasource, primaryKey: string) {
    const oldEntity = ds.currentEntity;
    ds.currentEntity = null;
    let index = -1;
    if (oldEntity) {
        const rows = ds.getRows();

        rows.forEach((r, i) => {
            if (r[primaryKey] === oldEntity[primaryKey]) {
                index = i;
            }
        });
    }
    ds.reloadDatasource();
    if (oldEntity) {
        ds.setRowAsCurrentEntity(index);
    }

    ds.__callSubscribers("collection-sorted"); //TODO: need to fix in grid
}
