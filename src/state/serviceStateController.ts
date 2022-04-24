import create from "zustand";

type serviceStateControllerType = {
    // loading
    loadingDataDialogActived: boolean;
    loadingDataDialogContent: string | null;
    loadingDataDialogHeader: string | null;
    loadingDataRuntimeMilliseconds: number;
    loadingDataReplyMilliseconds: number;
    loadingDataRowCount: number;
    activateLoadingData: () => void;
    deactivateLoadingData: () => void;

    //error
    errorDialogHeader: string | null;
    errorDialogContent: string | null;
    errorDialogActivated: boolean;
    activateErrorDialog: () => void;
    deactivateErrorDialog: () => void;
};

/**
 * this state holds loading data and error data
 */
export const serviceStateController = create<serviceStateControllerType>((set) => ({
    // loading
    loadingDataDialogActived: false,
    loadingDataDialogContent: "",
    loadingDataDialogHeader: "",
    loadingDataRuntimeMilliseconds: 0,
    loadingDataReplyMilliseconds: 0,
    loadingDataRowCount: 0,
    activateLoadingData: () => set(() => ({ loadingDataDialogActived: true })),
    deactivateLoadingData: () => set(() => ({ loadingDataDialogActived: false })),

    //error
    errorDialogHeader: "",
    errorDialogContent: "",
    errorDialogActivated: false,
    activateErrorDialog: () => set(() => ({ errorDialogActivated: true })),
    deactivateErrorDialog: () => set(() => ({ errorDialogActivated: false }))
}));
