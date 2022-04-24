/**
 * mostly just for keeping track of url settings etc for grid
 * this will only be used by dynamic report part
 */

type tempSettingState = {
    paths: string[];
    json: any[];
    sharedLinkState: string;
};

const tempSettingState: tempSettingState = {
    paths: [],
    json: [],
    sharedLinkState: ""
};

export function getLinkState() {
    return tempSettingState.sharedLinkState;
}

export function setLinkState(value: string) {
    tempSettingState.sharedLinkState = value;
}

export function tempSettingsExist(path: string) {
    return tempSettingState.paths.includes(path);
}

export function getTempSettings(path: string) {
    return tempSettingState.json[tempSettingState.paths.indexOf(path)];
}

export function setTempSettings(path: string, json: any) {
    if (tempSettingState.paths.includes(path)) {
        tempSettingState.json[tempSettingState.paths.indexOf(path)] = json;
    } else {
        tempSettingState.paths.push(path);
        tempSettingState.json.push(json);
    }
}
