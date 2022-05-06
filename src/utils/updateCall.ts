import { Entity } from "@simple-html/datasource";
import { GridInterface } from "@simple-html/grid";
import { ApiInterface } from "@rad-common";
import { Service } from "./service";
import { getModifiedFilter } from "./getModifiedFilter";

export async function updateCall(
    gridInterface: GridInterface<any>,
    tableConfig: ApiInterface,
    service: Service,
    defaultQuery?: any
) {
    // this contains all data, even if its currently not showing in grid
    const data: Entity[] = gridInterface.getDatasource().getAllData();

    // this will have all CRUD (not R) operations
    const updateInsertDelete: any[] = [];
    const newRows: any[] = [];

    // part 1 -> get edited columns first and new if any
    // new columns will not have primary column included, they are default negative value, so we skip that column
    data.forEach((row: Entity | any) => {
        // if edited, proxy in grid controls this
        if (row.__controller?.__edited || row.__controller?.__isNew) {
            // temp storage of key/values until we add 1 complete object into updateCreateDeletions
            const edits: [any, any][] = [];

            // for each edited prop
            for (const k in row.__controller.__editedProps) {
                if (k && row.__controller.__editedProps[k]) {
                    // if we have data, send to array [key, value]
                    edits.push([k, row.__controller.__currentValues[k]]);
                }
            }

            // I also need the primary key, so we know what to update
            if (row.__controller.__edited && !row.__controller.__isNew) {
                if (row.__controller.__editedProps[tableConfig.primaryKey]) {
                    // if primary key is edited, then we need to get the old
                    edits.push(["PRIMARY_KEY_VAR", row.__controller.__originalValues[tableConfig.primaryKey]]);
                } else {
                    edits.push(["PRIMARY_KEY_VAR", row[tableConfig.primaryKey]]);
                }
                edits.push(["__$update", 1]);
            }

            if (row.__controller.__isNew) {
                edits.push(["PRIMARY_KEY_VAR", row[tableConfig.primaryKey]]);
                edits.push(["__$insert", 1]);
                newRows.push(row[tableConfig.primaryKey]);
            }

            // from entired will generate object from the [key, value]
            updateInsertDelete.push(Object.fromEntries(edits));
        }
    });

    // part 2: add deleted, we aslo tag these so server knows
    gridInterface
        .getDatasource()
        .getMarkedForDeletion()
        .forEach((r: any) => {
            if (!r.__controller.__isNew) {
                // if new, we skip.. nothing to delete really
                // same as edits, if primary key was edited before deleting, then we want to use old..
                if (r.__controller.__editedProps[tableConfig.primaryKey]) {
                    updateInsertDelete.push({
                        PRIMARY_KEY_VAR: r.__controller.__originalValues[tableConfig.primaryKey],
                        __$delete: 1
                    });
                } else {
                    // not edit, we use default primary key
                    updateInsertDelete.push({
                        PRIMARY_KEY_VAR: r[tableConfig.primaryKey],
                        __$delete: 1
                    });
                }
            }
        });

    // loop and get rows of new entities we need to add to selection
    const sel = gridInterface.getDatasource().getSelection();
    const filteredData = gridInterface.getDatasource().getRows(true);
    const selectedRows = sel.getSelectedRows();
    const tempNewIds = selectedRows.map((x: any) => filteredData[x][tableConfig.primaryKey]).filter((x: any) => x < 0);

    // save rows that needs to be remembered to later
    const rowNeedsToBeReselected: number[] = [];
    newRows.forEach((x, i) => {
        if (tempNewIds.includes(x)) {
            rowNeedsToBeReselected.push(i);
        }
    });

    // send to server and get ID of new rows if any
    const result = await service.update(updateInsertDelete);

    // get current gridconfig, so we can set it back and keep scroll position
    const gridConfig = gridInterface.saveSettings();

    if (result.success) {
        const IDs = result.data;

        // helper for getting modified columns only
        if (tableConfig.modified && service.getLastRequestTimestamp()) {
            const query = getModifiedFilter(defaultQuery, tableConfig.modified, service.getLastRequestTimestamp());
            if (!defaultQuery) {
                await service.loadAll(query, true);
            } else {
                await service.loadAll(query, false);
            }
        } else {
            // TODO, do I really want to load all by default?
            await service.loadAll(defaultQuery);
            // not sure how I want this..
        }

        if (Array.isArray(IDs) && IDs.length) {
            // add missing selection
            const selectKeys: any[] = [];
            IDs.forEach((v: any, i) => {
                if (rowNeedsToBeReselected.includes(i)) {
                    selectKeys.push(v);
                }
            });

            // if any IDS we need to add them to the selection so this can stay updated
            gridInterface.getDatasource().getSelection().addSelectedKeys(selectKeys);
        }

        // save is successfull, remove the ones marked for deleting if any
        gridInterface.getDatasource().clearMarkedForDeletion();

        // set back, so we keep scroll position
        gridInterface.loadSettings(gridConfig);
        return result;
    } else {
        return result;
    }
}
