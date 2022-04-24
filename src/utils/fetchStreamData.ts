/* eslint-disable @typescript-eslint/ban-ts-comment */

import { transformData } from "./transformData";
import { oracleArrayToJsonProxy } from "./oracleArrayToJsonProxy";
import { FilterArgument } from "@simple-html/datasource";

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
    let fetchedRows = 0;

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

        callback({ type: "time-first", data: performance.now() - t0 });

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        if (reader) {
            // this will hold leftover data between every read
            let cache = "";

            let firstCall = true;

            while (true) {
                const { value, done } = await reader.read();

                // if we have any in cache, then we need to add it before new value
                let text = cache + (value || ""); // if value is undefined, just use ""
                cache = "";

                if (firstCall) {
                    text = text.substring(1, text.length);
                    firstCall = false;
                }

                // length we need to loop
                const length = text.length;

                // check if we have text, and it starts with open bracket
                if (text && text.length) {
                    // set open bracket to buffer
                    let buffer = "";
                    // since we skip first bracket we set group to 1
                    let group = 0;

                    // loop all and skip first letter
                    for (let i = 0; i < length; i++) {
                        // add letter to our buffer
                        buffer = buffer + text[i];

                        // if open bracket, then its a new group
                        if (text[i] === "{") {
                            group++;
                        }

                        // if close, then group is done
                        if (text[i] === "}") {
                            group--;
                        }

                        // if close bracket, and group is 0, then we are in the end of our array, send back data to caller
                        if (text[i] === "}" && group === 0) {
                            if (buffer[0] === ",") {
                                buffer = buffer.substring(1, buffer.length);
                            }

                            callback({ type: "data", data: JSON.parse(buffer) });
                            buffer = "";
                        }

                        // last row, if anything in buffer then we need to keep it
                        if (buffer && length - 1 === i) {
                            cache = buffer;
                            buffer = "";
                        }
                    }

                    // if done and we only have bracket of "array" left then we are in the end..

                    if (done && text === "]") {
                        break;
                    }
                    if (done && !value) {
                        callback({
                            type: "error",
                            data: "unexpected result, bad data from server?, unparsed data:" + text
                        });
                    }
                } else {
                    if (done) {
                        break;
                    } else {
                        if (text && text.length) {
                            callback({ type: "error", data: "unexpected result, expected [, but got" + text[0] });
                        }
                    }
                }
            }
        } else {
            callback({ type: "error", data: "body empty" });
        }
    } catch (e) {
        callback({ type: "error", data: e });
    }

    callback({ type: "length", data: fetchedRows });
    callback({ type: "time-total", data: performance.now() - t0 });
}

// callback type
type streamCallback = (update: { type: "data" | "length" | "time-first" | "time-total" | "error"; data: any }) => void;

// simple data type
export type metaData = {
    byteSize: number;
    dbType: number;
    dbTypeName: "VARCHAR2" | "NUMBER" | "DATE" | "BOOLEAN"; // use main types not
    fetchType: number;
    name: string;
    nullable: boolean;
};
