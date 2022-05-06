export function toggelDarkTheme(darktheme: boolean) {
    if (darktheme) {
        document.getElementsByTagName("HTML")[0].className = "dark";
    } else {
        document.getElementsByTagName("HTML")[0].className = "";
    }
    window.localStorage.setItem("theme", darktheme ? "Y" : "N");
}
