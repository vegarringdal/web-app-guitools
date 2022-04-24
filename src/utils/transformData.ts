import { metaData } from "./fetchStreamData";

// internal transform function
// json does not support date, and I need to take string values from DB and convert them to real number
export function transformData(metaData: metaData[], dataRows: any[]) {
    dataRows.forEach((row: any[]) => {
        metaData.forEach((col, i) => {
            if (col.dbTypeName === "NUMBER") {
                if (row[i] !== null && row[i] !== undefined) {
                    row[i] = row[i] * 1;
                }
            }

            if (col.dbTypeName === "DATE") {
                if (row[i] !== null && row[i] !== undefined) {
                    //html input shows only utc date ??!? I dont knwo why, so I need to convert it
                    // I think I need to add callback or manualy creatte date input alternative in grid
                    //row[i] = new Date(new Date(row[i])+new Date(row[i]).getTimezoneOffset())
                    // I cant do what I did above, since I will actualy have wrong date... also need timestamp out
                    row[i] = new Date(row[i]);
                }
            }
        });
    });
}
