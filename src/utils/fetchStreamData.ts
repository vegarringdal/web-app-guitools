/* eslint-disable @typescript-eslint/ban-ts-comment */

import { transformData } from "./transformData";
import { oracleArrayToJsonProxy } from "./oracleArrayToJsonProxy";
import { FilterArgument } from "@simple-html/datasource";
import { STREAM_WRITE_ARRAY_SPLIT } from "./STREAM_WRITE_ARRAY_SPLIT";
import { STREAM_WRITE_TAG_END } from "./STREAM_WRITE_TAG_END";

/**
 * fetches data by streaming to client, uses my custom api service
 * @param httpUrl
 * @param query
 * @param callback
 * @returns
 */
export async function fetchStreamData(
    httpUrl: string,
    query: FilterArgument | undefined | null,
    callback: streamCallback
) {
    const t0 = performance.now();
    let requestID = null;
    let metadata = null;
    let fetchedRows = 0;
    let spareChunk = "";
    let prevvalue = "";
    const metadataObj: any = {};

    try {
        const response = await fetch(httpUrl, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: query ? JSON.stringify(query) : null
        });

        // if error show this
        if (!response.ok || !response.body) {
            callback({ type: "error", data: response.statusText });
            return;
        }

        if (!requestID) {
            callback({ type: "time-first", data: performance.now() - t0 });
        }
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        while (true) {
            // eslint-disable-next-line prefer-const
            let { value, done } = await reader.read();
            if (done) break;

            if (spareChunk) {
                value = spareChunk + value;
                spareChunk = "";
            }

            // get our stream tag
            const data = value?.split(STREAM_WRITE_ARRAY_SPLIT) || [];
            let tempDataArray: any[] = [];

            data.forEach((chunk: string) => {
                // if we have spare data, (data between array we need to use it now with the new data)

                if (chunk && chunk.length > 5) {
                    const TAG_END = chunk.substr(chunk.length - 5, chunk.length - 1);
                    if (TAG_END === STREAM_WRITE_TAG_END) {
                        //its end of a stream send, lets use it
                        let parsedChunk;
                        try {
                            parsedChunk = JSON.parse(chunk.substr(0, chunk.length - 5));
                        } catch (e) {
                            // TODO: lets add a application-common log for client
                            console.error("error", e);
                            console.error("data array", data);
                            console.error("value", value);
                            console.error("error", prevvalue);
                        }

                        tempDataArray = tempDataArray.concat(parsedChunk);
                    } else {
                        // not full stream data, save it for next parse
                        spareChunk = chunk;
                    }
                } else {
                    // if less then 5 its a spare chunk
                    spareChunk = chunk;
                }
            });

            prevvalue = value || "";

            if (!requestID && tempDataArray.length) {
                requestID = tempDataArray.shift();
                metadata = tempDataArray.shift();

                metadata.forEach((x: any, i: number) => {
                    metadataObj[x.name] = i;
                });

                callback({ type: "requestid", data: requestID });
                callback({ type: "meta", data: metadata });
            }
            fetchedRows = fetchedRows + tempDataArray.length;
            transformData(metadata, tempDataArray);

            callback({
                type: "data",
                data: oracleArrayToJsonProxy(metadata, metadataObj, tempDataArray)
            });
            callback({ type: "length", data: fetchedRows });
        }
    } catch (e) {
        callback({ type: "error", data: e });
    }

    callback({ type: "length", data: fetchedRows });
    callback({ type: "time-total", data: performance.now() - t0 });
}

// callback type
type streamCallback = (update: {
    type: "requestid" | "meta" | "data" | "length" | "time-first" | "time-total" | "error";
    data: any;
}) => void;

// simple data type
export type metaData = {
    byteSize: number;
    dbType: number;
    dbTypeName: "VARCHAR2" | "NUMBER" | "DATE" | "BOOLEAN"; // use main types not
    fetchType: number;
    name: string;
    nullable: boolean;
};
