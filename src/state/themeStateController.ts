import create from "zustand";
import { toggelDarkTheme } from "../utils/darkThemeHelpers";

type themeStateControllerType = {
    darktheme: boolean;
    setDarkTheme: (state: boolean) => void;
    toggleDarkMode: () => void;
};

/**
 * controlles the darktheme of app
 */
export const themeStateController = create<themeStateControllerType>((set) => ({
    darktheme: true,
    setDarkTheme: (state: boolean) => set(() => ({ darktheme: state })),
    toggleDarkMode: () => {
        set((state) => {
            const newState = state.darktheme ? false : true;
            toggelDarkTheme(newState);
            return { darktheme: newState };
        });
    }
}));
