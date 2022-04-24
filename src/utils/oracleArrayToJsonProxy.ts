// TODO: improve types..
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-rest-params */

import { metaData } from "./fetchStreamData";

export function oracleArrayToJsonProxy(metaData: metaData[], metadataObj: any, dataRows: any[]) {
    const jsonArray: any[] = [];
    dataRows.forEach((row: any[]) => {
        return jsonArray.push(
            new Proxy(
                { __$r: row, __$m: metaData },
                {
                    has: function (target, prop) {
                        const flag = Reflect.has(target, prop);
                        return flag;
                    },
                    get: function (_target: any, prop, _receiver) {
                        if (prop === "hasOwnProperty") {
                            return this.hasOwnProperty;
                        }
                        if (metadataObj[prop] !== undefined) {
                            return _target.__$r[metadataObj[prop]];
                        }
                        //@ts-ignore
                        return Reflect.get(...arguments);
                    },
                    //@ts-ignore
                    hasOwnProperty: function (prop: any) {
                        return (this as any).__$r[metadataObj[prop]] !== undefined;
                    },
                    set: function (_target: any, prop, value, _receiver) {
                        if (metadataObj[prop] !== undefined) {
                            _target.__$r[metadataObj[prop]] = value;
                            return true;
                        }
                        //@ts-ignore
                        return Reflect.set(...arguments);
                    }
                }
            )
        );
    });
    return jsonArray;
}
