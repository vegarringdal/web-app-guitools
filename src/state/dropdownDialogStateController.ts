import create from "zustand";

type dropdownDialogStateType = {
    controllerName: string;
    parentViewApi: string;
    parentTitle: string;
    parentFrom: string;
    parentTo: string;
    parentColumnsFromTo?: string[][];
    relatedDialogActivated: boolean;
    top: number;
    left: number;
    width: number;
    height: number;
    activateRelatedDialog: (
        controllerName: string,
        parentViewApi: string,
        parentTitle: string,
        parentFrom: string,
        parentTo: string,
        parentColumnsFromTo: string[][]
    ) => void;
    deactivateRelatedDialog: () => void;
};

/**
 * keeps track of datacontroller name and related data
 * we use this to controll the related dialog
 */
export const dropdownDialogStateController = create<dropdownDialogStateType>((set) => ({
    controllerName: "",
    parentViewApi: "",
    parentTitle: "",
    relatedDialogActivated: false,
    parentFrom: "",
    parentTo: "",
    parentColumnsFromTo: [],
    top: 0,
    left: 0,
    width: 300,
    height: 500,
    activateRelatedDialog: (
        controllerName: string,
        parentTitle: string,
        parentViewApi: string,
        parentFrom: string,
        parentTo: string,
        parentColumnsFromTo: string[][]
    ) =>
        set(() => ({
            controllerName: controllerName,
            parentTitle: parentTitle,
            parentViewApi: parentViewApi,
            parentFrom: parentFrom,
            parentTo: parentTo,
            parentColumnsFromTo: parentColumnsFromTo,
            relatedDialogActivated: true
        })),
    deactivateRelatedDialog: () => set(() => ({ relatedDialogActivated: false }))
}));
