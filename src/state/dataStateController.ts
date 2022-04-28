import create from "zustand";

type dataStateControllerType = {
    controllerName: string;
    parentViewApi: string;
    parentTitle:string,
    parentFrom: string;
    parentTo: string;
    parentColumnsFromTo?: string[][];
    relatedDialogActivated: boolean;
    activateRelatedDialog: (
        controllerName: string,
        parentViewApi: string,
        parentTitle:string,
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
export const dataStateController = create<dataStateControllerType>((set) => ({
    controllerName: "",
    parentViewApi: "",
    parentTitle:"",
    relatedDialogActivated: false,
    parentFrom: "",
    parentTo: "",
    parentColumnsFromTo:[],
    activateRelatedDialog: (controllerName:string, parentTitle:string, parentViewApi: string, parentFrom: string, parentTo: string, parentColumnsFromTo:string[][]) =>
        set(() => ({
            controllerName: controllerName,
            parentTitle: parentTitle,
            parentViewApi: parentViewApi,
            parentFrom: parentFrom,
            parentTo: parentTo,
            parentColumnsFromTo: parentColumnsFromTo,
            relatedDialogActivated: true,
        })),
    deactivateRelatedDialog: () => set(() => ({ relatedDialogActivated: false }))
}));
