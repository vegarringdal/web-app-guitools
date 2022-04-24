import create from "zustand";

type dataStateControllerType = {
    mainDataControllerName: string;
    relatedData: string;
    relationColumn: string;
    insertFromColumn: string;
    relatedDialogActivated: boolean;
    activateRelatedDialog: (
        controllerName: string,
        relatedData: string,
        insertFromColumn: string,
        relationColumn: string
    ) => void;
    deactivateRelatedDialog: () => void;
};

/**
 * keeps track of datacontroller name and related data
 * we use this to controll the related dialog
 */
export const dataStateController = create<dataStateControllerType>((set) => ({
    mainDataControllerName: "",
    relatedData: "",
    relatedDialogActivated: false,
    relationColumn: "",
    insertFromColumn: "",
    activateRelatedDialog: (controllerName, relatedData: string, insCol: string, relCol: string) =>
        set(() => ({
            mainDataControllerName: controllerName,
            relatedDialogActivated: true,
            relatedData: relatedData,
            relationColumn: relCol,
            insertFromColumn: insCol
        })),
    deactivateRelatedDialog: () => set(() => ({ relatedDialogActivated: false }))
}));
