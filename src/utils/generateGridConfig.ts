import type { GridConfig } from "@simple-html/grid/dist/types";
import { getDataControllerByName } from "./getDataControllerByName";
import {
    getLinkState,
    getTempSettings,
    setLinkState,
    setTempSettings,
    tempSettingsExist
} from "../state/tempGridSettingsState";
import { parseAndFixGridConfig } from "./parseAndFixGridConfig";
/* import { mergeSettingsAndFix } from "./parseAndFixGridConfig"; */

/**
 * generates gridconfig from oracle metadata
 * TODO, clean up URL/SAVE URL part
 * @param metadata
 * @param metaDataOnly
 * @param dataset
 * @returns
 */
export function generateGridConfig(metadata: any[], metaDataOnly: boolean, dataset: string) {
    const settings = metaDataOnly ? ({} as any) : getDataControllerByName(dataset).gridInterface.saveSettings();

    const defaultGrid: GridConfig = {
        cellHeight: 20,
        panelHeight: 25,
        footerHeight: 35,
        readonly: true,
        selectionMode: "multiple",
        groups: [] as any,
        filterSet: settings.filterSet || ([] as any),
        sortingSet: settings.sortingSet || ([] as any),
        groupingExpanded: settings.groupingExpanded || ([] as any),
        groupingSet: settings.groupingSet || ([] as any)
    };

    function type(type: string) {
        if (type === "NUMBER") {
            return "number";
        }

        if (type === "DATE") {
            return "date";
        }

        return "text";
    }

    if (Array.isArray(metadata)) {
        metadata.forEach((attribute: any) => {
            defaultGrid.groups.push({
                width: 100,
                rows: [
                    {
                        header: attribute.name,
                        attribute: attribute.name,
                        type: type(attribute.dbTypeName),
                        filterable: {},
                        sortable: {},
                        allowGrouping: true
                    }
                ]
            });
        });
    }

    getDataControllerByName(dataset).gridInterface.loadSettings(defaultGrid, true);

    const UrlPath = location.hash.split("?")[0];
    const settingSTRING = localStorage.getItem(UrlPath);
    const savedQuery = getLinkState();

    if (savedQuery) {
        setLinkState("");
        try {
            const decodedString = decodeURIComponent(savedQuery);
            // why do I need to decode 2 times?
            const settings = JSON.parse(decodeURIComponent(decodedString));

            setTempSettings(UrlPath, settings);

            const gridConfig: GridConfig = getDataControllerByName(dataset).gridInterface.saveSettings();
            const mergedSettings = parseAndFixGridConfig(settings, gridConfig);
            // force just incase someone save before I enabled
            mergedSettings.readonly = true;
            getDataControllerByName(dataset).gridInterface.loadSettings(mergedSettings, true);

            return;
        } catch (e) {
            debugger;
        }
    }

    if (tempSettingsExist(UrlPath)) {
        try {
            const gridConfig: GridConfig = getDataControllerByName(dataset).gridInterface.saveSettings();
            const mergedSettings = parseAndFixGridConfig(getTempSettings(UrlPath), gridConfig);
            // force just incase someone save before I enabled
            mergedSettings.readonly = true;
            getDataControllerByName(dataset).gridInterface.loadSettings(mergedSettings);
            return;
        } catch (e) {
            debugger;
        }
    }

    if (settingSTRING) {
        const settings: GridConfig = JSON.parse(settingSTRING);
        // get current default cells
        const gridConfig: GridConfig = getDataControllerByName(dataset).gridInterface.saveSettings();

        const mergedSettings = parseAndFixGridConfig(settings, gridConfig);
        // force just incase someone save before I enabled
        mergedSettings.readonly = true;
        getDataControllerByName(dataset).gridInterface.loadSettings(mergedSettings);
    } else {
        getDataControllerByName(dataset).gridInterface.autoResizeColumns();
    }
}
