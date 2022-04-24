import { GridConfig } from "@simple-html/grid/dist/types";

/**
 * parses gridconfig with current
 * removed and add new columns if any
 * @param newSettings
 * @param existingSettings
 * @returns
 */
export function parseAndFixGridConfig(newSettings: GridConfig, existingSettings: GridConfig) {
    const tempNewSettings: GridConfig = JSON.parse(JSON.stringify(newSettings));

    const cellsDefault = existingSettings.groups.flatMap((g) => g?.rows?.map((r) => r));
    existingSettings.optionalCells?.forEach((row) => {
        if (row) {
            cellsDefault.push(row);
        }
    });

    // get new config cells
    const cellsNew = tempNewSettings.groups.flatMap((g) => g?.rows?.map((r) => r));
    tempNewSettings.optionalCells?.forEach((row) => {
        if (row) {
            cellsNew.push(row);
        }
    });

    // compare and corret header and type
    // also add to optional if not added
    const attributes: string[] = [];
    cellsDefault.forEach((defaultCell) => {
        let found = false;
        attributes.push(defaultCell.attribute);
        cellsNew.forEach((newCell) => {
            if (newCell.attribute === defaultCell.attribute) {
                found = true;
                if (newCell.header !== defaultCell.header) {
                    newCell.header = defaultCell.header;
                }
                if (newCell.type !== defaultCell.type) {
                    newCell.type = defaultCell.type;
                }
            }
        });
        if (!found) {
            if (Array.isArray(tempNewSettings.optionalCells)) {
                tempNewSettings.optionalCells.push(defaultCell);
            } else {
                tempNewSettings.optionalCells = [];
                tempNewSettings.optionalCells.push(defaultCell);
            }
        }
    });

    // tag cells we need to remove
    cellsNew.forEach((cell) => {
        if (attributes.indexOf(cell.attribute) === -1) {
            (cell as any).toRemove = true;
        }
    });

    // filter out optional cells
    tempNewSettings.optionalCells = tempNewSettings.optionalCells?.filter((row) => {
        if (!(row as any).toRemove) {
            return true;
        } else {
            return false;
        }
    });

    // filter out cells we dont have anymore
    tempNewSettings.groups.forEach((g) => {
        g.rows = g?.rows?.filter((row) => {
            if (!(row as any).toRemove) {
                return true;
            } else {
                return false;
            }
        });
    });

    // filter away empty groups
    tempNewSettings.groups = tempNewSettings.groups.filter((g) => {
        if (g?.rows.length) {
            return true;
        } else {
            return false;
        }
    });

    return tempNewSettings;
}
