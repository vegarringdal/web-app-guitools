import { themeStateController } from "../state/themeStateController";

let init = false; // so we dont end up in endless loop

export function initDarkTheme() {
    if (!init) {
        init = true;
        const theme = themeStateController.getState();
        const initStatus = window.localStorage.getItem("theme");
        if (initStatus === null) {
            window.localStorage.setItem("theme", "Y");
            theme.setDarkTheme(true);
            document.getElementsByTagName("HTML")[0].className = "dark";
        } else {
            if (initStatus !== "Y") {
                document.getElementsByTagName("HTML")[0].className = "";
            } else {
                document.getElementsByTagName("HTML")[0].className = "dark";
            }
            theme.setDarkTheme(initStatus === "Y" ? true : false);
        }
    }
}
