import {
    worksheet_PATH,
    worksheet_XML,
    rels_PATH,
    rels_XML,
    theme1_PATH,
    theme1_XML,
    sharedString_PATH,
    sharedString_XML,
    styles_PATH,
    styles_XML,
    workbook_PATH,
    workbook_XML,
    app_PATH,
    app_XML,
    content_PATH,
    content_XML,
    core_PATH,
    core_XML,
    relM_PATH,
    relM_XML,
    worksheet_XML_footer,
    worksheet_XML_header
} from "./excelTemplates";
import * as fflate from "fflate";
import { GridConfig } from "@simple-html/grid/dist/types";
import { GridInterface } from "@simple-html/grid";
import { generateExcelCallbackType } from "./generateExcelCallbackType";

export function generateExcel(
    gridInterface: GridInterface<any>,
    selectionOnly: boolean,
    callback: generateExcelCallbackType
) {
    return new Promise(async (resolve) => {
        // check if browser support filesystem access api
        // is supported by newest chrome/edge
        if (typeof showSaveFilePicker !== "function") {
            callback({
                type: "error",
                header: "Excel error",
                content: "Your browser does not support filesystem Access Api, use newest Chrome/Edge"
            });

            resolve(false);
            return;
        }

        // helper funtion to give system time to breath
        function wait(timeout = 30) {
            return new Promise((r: any) => {
                setTimeout(() => {
                    r();
                }, timeout);
            });
        }

        const currentDataSet = gridInterface.getDatasource().getRows(!selectionOnly);
        let excelData: any[] = [];

        // if we do not have any data then just stop/display error
        if (currentDataSet.length === 0) {
            callback({
                type: "error",
                header: "Excel error",
                content: "Excel file error ->  no records in dataset"
            });
            resolve(false);
            return;
        }

        if (!selectionOnly) {
            excelData = currentDataSet;
        } else {
            const selected = gridInterface.getSelectedRows();

            // same as before, if no data, then just stop and display error
            if (selected.length === 0) {
                callback({
                    type: "error",
                    header: "Excel error",
                    content: "Excel file error -> no rows selected"
                });

                resolve(false);
                return;
            }

            selected.forEach((element: any) => {
                const rowData = currentDataSet[element];
                if (rowData as any) {
                    excelData.push(currentDataSet[element]);
                }
            });
        }

        const fileSystemAccessOptions = {
            types: [
                {
                    description: "Excel files",
                    accept: {
                        "text/plain": [".xlsx"]
                    }
                }
            ]
        };
        // this is native chrome/edge file picker
        const handle = await showSaveFilePicker(fileSystemAccessOptions);

        // update status
        callback({
            type: "info",
            header: "Generating excel",
            content: "This can take a while if hardware is slow\nTry and save to local storage, not network disk\n"
        });

        const writable = await handle.createWritable();
        const v0 = performance.now();

        // generate zip file, we will stream data to this when possible
        // to much will just kill performance and to little will kill memory:-)
        // having this in a worker would probably help, hacking it with timeouts to not lock gui atm
        const zip = new fflate.Zip(async (err, dat, final) => {
            if (!err) {
                // output of the streams
                try {
                    await writable.write(dat);
                } catch (e) {
                    callback({
                        type: "error",
                        header: "Excel error",
                        content: "Excel file error -> " + e
                    });
                    resolve(false);
                }
                if (final) {
                    try {
                        await writable.close();
                    } catch (e) {
                        callback({
                            type: "error",
                            header: "Excel error",
                            content: "Excel file error -> " + e
                        });
                        resolve(false);
                        return;
                    }

                    callback({
                        type: "info",
                        header: "Generating Excel",
                        content: "excel generated in:" + (performance.now() - v0).toString().split(".")[0] + "ms"
                    });

                    await wait(1300);
                    resolve(true);
                }
            }
        });

        // helper for addign content
        function addFileAndContent(filepath: string, content: string) {
            const file = new fflate.ZipDeflate(filepath, {
                level: 2
            });
            zip.add(file);
            file.push(fflate.strToU8(content), true);
        }

        // add default content, unpacked blank excel file to find out to make it..
        addFileAndContent(app_PATH, app_XML);
        addFileAndContent(relM_PATH, relM_XML);
        addFileAndContent(core_PATH, core_XML);
        addFileAndContent(content_PATH, content_XML);
        addFileAndContent(rels_PATH, rels_XML);

        addFileAndContent(theme1_PATH, theme1_XML);
        addFileAndContent(styles_PATH, styles_XML);
        addFileAndContent(workbook_PATH, workbook_XML);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const gridConfig: GridConfig = gridInterface.saveSettings();
        const attributes = gridConfig.groups.flatMap((g) => g.rows.map((r) => r));
        const sharedString = new Map<string, number>();
        const totalCells = attributes.length * excelData.length + attributes.length;
        let id = 0;

        // prettyprint header text for excel files
        // we pretty much remove the underscore and uppercase each word
        attributes.forEach((e) => {
            let last: null | string = null;
            e.header = "";
            if (!e.header) {
                e.header = e.attribute
                    .split("")
                    .map((v: any) => {
                        if (last === null || last === "_") {
                            last = v;
                            return v.toUpperCase();
                        }
                        if (v === "_") {
                            last = v;
                            return " ";
                        }
                        last = v;
                        return v.toLowerCase();
                    })
                    .join("");
            }
        });

        // generate headers
        const headerRow = `<row r="1" spans="1:${attributes.length}" x14ac:dyDescent="0.25">${attributes
            .map((a) => {
                if (a.header) {
                    if (!sharedString.has(a.header)) {
                        sharedString.set(a.header, id++);
                    }
                    return `<c t="s"><v>${sharedString.get(a.header)}</v></c>`;
                } else {
                    return `<c t="s"><v></v></c>`;
                }
            })
            .join("")}</row>`;

        const worksheetZip = new fflate.ZipDeflate(worksheet_PATH, {
            level: 2
        });
        zip.add(worksheetZip);

        // header part
        worksheetZip.push(fflate.strToU8(worksheet_XML_header()), false);
        worksheetZip.push(fflate.strToU8(worksheet_XML(headerRow)), false);

        // generates content/rows
        let last = 0; //  last batch
        let y = 1; // rowCount helper
        for (let i = 0; i < 100; i++) {
            if (last < excelData.length) {
                const bufferArray = excelData.slice(last, (i + 1) * 5000);
                last = (i + 1) * 5000;

                // give process breathing time, tried worker but did not gain much where is was needed
                // hopefully this will stop browser from thinking its dying :-)
                await wait();

                if (bufferArray.length) {
                    const tempContentString: string = bufferArray
                        .map((row: any) => {
                            const rowCount = y;
                            y++;
                            return `<row r="${rowCount + 1}" spans="1:${
                                attributes.length
                            }" x14ac:dyDescent="0.25">${attributes
                                .map((a) => {
                                    if (a.type === "number") {
                                        return `<c><v>${
                                            row[a.attribute] !== null && row[a.attribute] !== undefined
                                                ? row[a.attribute]
                                                : 0
                                        }</v></c>`;
                                    }

                                    if (a.type === "date") {
                                        return `<c s="1"><v>${
                                            row[a.attribute]?.getTime
                                                ? // from exceljs, but user still need to convert/format..
                                                  25569 + row[a.attribute].getTime() / (24 * 3600 * 1000)
                                                : ""
                                        }</v></c>`;
                                    }

                                    if (a.type === "boolean") {
                                        const val = row[a.attribute] ? "Y" : "N";

                                        if (!sharedString.has(val)) {
                                            sharedString.set(val, id++);
                                        }

                                        return `<c t="s"><v>${sharedString.get(val)}</v></c>`;
                                    }

                                    if (row[a.attribute]) {
                                        // replace problem strings, these are not valid in xml
                                        const exc = row[a.attribute]
                                            .replace(/&/g, "&amp;")
                                            .replace(/</g, "&lt;")
                                            .replace(/>/g, "&gt;")
                                            .replace(/'/g, "&#39;")
                                            .replace(/"/g, "&#34;")
                                            // https://stackoverflow.com/questions/397250/unicode-regex-invalid-xml-characters
                                            .replace(
                                                /(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFEFF\uFFFE\uFFFF]/g,
                                                ""
                                            );
                                        if (!sharedString.has(exc)) {
                                            sharedString.set(exc, id++);
                                        }

                                        return `<c t="s"><v>${sharedString.get(exc)}</v></c>`;
                                    }
                                    return `<c><v></v></c>`;
                                })
                                .join("")}</row>`;
                        })
                        .join("");
                    worksheetZip.push(fflate.strToU8(worksheet_XML(tempContentString)), false);
                }
            }
        }

        // lets do footer/last part, here we will add autofilter
        // finds column A - Z, if higher than 26 columns, then AA, AB etc
        let letterNo = attributes.length; // same as columns in excel..
        const noOfColumns = attributes.length;
        let alphabetParts = 0;
        if (noOfColumns > 26) {
            alphabetParts = Math.floor(noOfColumns / 26);
            letterNo = noOfColumns % 26;
            if (letterNo === 0) {
                letterNo = 26;
            }
        }
        let columnHeader = String.fromCharCode(64 + letterNo);
        if (alphabetParts) {
            const prefix = String.fromCharCode(64 + alphabetParts);
            columnHeader = prefix + columnHeader;
        }

        worksheetZip.push(fflate.strToU8(worksheet_XML_footer(columnHeader)), true);

        /**************************
         * now we need to add shared string
         */
        const sharedStringZip = new fflate.ZipDeflate(sharedString_PATH, {
            level: 2
        });

        zip.add(sharedStringZip);

        // generates sharedstring xml
        // excel shares strings between cells
        let lastColumnCount = 0;
        const sharedStringArray = Array.from(sharedString);

        let sharedStringTemplate = "";
        for (let i = 0; i < 100; i++) {
            if (lastColumnCount < sharedStringArray.length) {
                const bufferArray = sharedStringArray.slice(lastColumnCount, (i + 1) * 5000);
                lastColumnCount = (i + 1) * 5000;

                // give process breathing time, tried worker but did not gain much where is was needed
                // hopefully this will stop browser from thinking its dying :-)
                await wait();

                if (bufferArray.length) {
                    const tempContentString = bufferArray
                        .map(([value]) => {
                            return `<si><t>${value}</t></si>`;
                        })
                        .join("");
                    sharedStringTemplate = sharedStringTemplate + tempContentString;
                }
            }
        }

        sharedStringZip.push(
            fflate.strToU8(sharedString_XML(sharedStringTemplate, sharedString.size, totalCells)),
            true
        );

        // we are done, lets close
        zip.end();
    });
}

// just to help typescript
declare const showSaveFilePicker: (x: any) => Promise<any>;
