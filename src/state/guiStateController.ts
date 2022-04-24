import create from "zustand";

type guiStateControllerType = {
    editMode: boolean;
    activateEditMode: () => void;
    deactivateEditMode: () => void;

    showMenu: boolean;
    setMenuStatus: (state: boolean) => void;

    maxRows: number;
    setMaxRows: (value: number) => void;

    currentUser: string;
    currentUserID: string;
    allUserRoles: string[];
    isCheckingAuthentication: boolean;
    isAuthenticationChecked: boolean;
    isProfileDialogActivated: boolean;
    activateProfileDialog: () => void;
    deactivateProfileDialog: () => void;
};

/**
 * Mostly app/gui state, these might be moved into own later
 */
export const guiStateController = create<guiStateControllerType>((set) => ({
    editMode: false,
    activateEditMode: () => set(() => ({ editMode: true })),
    deactivateEditMode: () => set(() => ({ editMode: false })),

    showMenu: true,
    setMenuStatus: (state: boolean) => set(() => ({ showMenu: state })),

    maxRows: 100000,
    setMaxRows: (state: number) => set(() => ({ maxRows: state })),

    isCheckingAuthentication: false,
    currentUser: "",
    currentUserID: "",
    allUserRoles: [],
    isAuthenticationChecked: false,
    isProfileDialogActivated: false,
    activateProfileDialog: () => set(() => ({ isProfileDialogActivated: true })),
    deactivateProfileDialog: () => set(() => ({ isProfileDialogActivated: false }))
}));
