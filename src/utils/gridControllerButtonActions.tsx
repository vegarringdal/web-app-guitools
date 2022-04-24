import { GridConfig } from "@simple-html/grid";
import { getDataControllerByName } from "./getDataControllerByName";
import { guiStateController } from "../state/guiStateController";
import { markForDeletion } from "./markForDeletion";
import { getApiConfig } from "./apiConfig";
import { generateExcel } from "./generateExcel";
import { generateExcelCallback } from "./generateExcelCallback";
import { serviceStateController } from "../state/serviceStateController";
import { navCompactionEvents } from "../components/GridControllerButtons";

/**
 * actions for grid Controller buttons
 * @param name
 * @param dataSet
 */
export async function gridControllerButtonActions(name: navCompactionEvents, dataSet: string) {
    const serviceState = serviceStateController.getState();
    const ds = getDataControllerByName(dataSet).dataSource;
    const gridInterface = getDataControllerByName(dataSet).gridInterface;
    const guiState = guiStateController.getState();

    /**
     * copy selected row and generates a new
     */
    function copy() {
        const ds = getDataControllerByName(dataSet).dataSource;
        const currentEntity: any = ds.currentEntity;
        ds.addNewEmpty();
        if (currentEntity.__controller.__isNew) {
            for (const k in currentEntity) {
                if (
                    k !== "__$m" &&
                    k !== "__controller" &&
                    k !== "__$r" &&
                    k !== getApiConfig(dataSet).api.primaryKey &&
                    k !== "__KEY"
                ) {
                    ds.currentEntity[k] = currentEntity[k];
                }
            }
        } else {
            for (let i = 0; i < currentEntity.__$r.length; i++) {
                if (currentEntity.__$m[i].name !== getApiConfig(dataSet).api.primaryKey) {
                    ds.currentEntity[currentEntity.__$m[i].name] = currentEntity.__$r[i];
                }
            }
        }
    }

    /**
     * resets all edits
     */
    function reset() {
        getDataControllerByName(dataSet).dataSource.resetData();
        const savedConfigSave: GridConfig = getDataControllerByName(dataSet).gridInterface.saveSettings();
        savedConfigSave.readonly = true;
        getDataControllerByName(dataSet).gridInterface.loadSettings(savedConfigSave);
        getDataControllerByName(dataSet).dataSource.reloadDatasource();
        guiState.deactivateEditMode();
    }

    /**
     * activates edit mode
     */
    function edit() {
        const savedConfigSave: GridConfig = getDataControllerByName(dataSet).gridInterface.saveSettings();
        savedConfigSave.readonly = false;
        getDataControllerByName(dataSet).gridInterface.loadSettings(savedConfigSave);
        guiState.activateEditMode();
    }

    /**
     * save edits
     */
    async function save() {
        const result = { data: "not implemented", success: false };
        if (result.success) {
            reset();
        } else {
            serviceState.errorDialogContent = result.data as string;
            serviceState.activateErrorDialog();
        }
    }

    /**
     * open gridconfig
     * TODO: make...
     */
    function openGridConfigDialog() {
        const result = { data: "not implemented", success: false };
        serviceState.errorDialogContent = result.data as string;
        serviceState.activateErrorDialog();
    }

    /**
     * opes save dialog so user can save current rows displayed in grid
     */
    async function createExcel() {
        serviceState.activateLoadingData();
        const gi = getDataControllerByName(dataSet).gridInterface;
        try {
            await generateExcel(gi, false, generateExcelCallback);
        } catch (e) {}
        serviceState.deactivateLoadingData();
    }

    /**
     * fetches all
     */
    function getAll() {
        const result = { data: "not implemented", success: false };
        serviceState.errorDialogContent = result.data as string;
        serviceState.activateErrorDialog();
    }

    /**
     * fetches all data with filter
     */
    function refresh() {
        const result = { data: "not implemented", success: false };
        serviceState.errorDialogContent = result.data as string;
        serviceState.activateErrorDialog();
    }

    switch (name) {
        case "getAll":
            getAll();
            break;
        case "refresh":
            refresh();
            break;
        case "excel":
            createExcel();
            break;

        case "gridConfig":
            openGridConfigDialog();
            break;

        case "first":
            ds.selectFirst();
            break;

        case "next":
            ds.selectNext();
            break;

        case "prev":
            ds.selectPrev();
            break;

        case "last":
            ds.selectLast();
            break;
        case "edit":
            edit();
            break;
        case "copy":
            copy();
            break;
        case "delete":
            markForDeletion(gridInterface);
            break;
        case "cancel":
            reset();
            break;
        case "new":
            gridInterface.getDatasource().addNewEmpty();
            break;
        case "save":
            await save();
            break;
        default:
            alert("not implmented:" + name);
    }
}
