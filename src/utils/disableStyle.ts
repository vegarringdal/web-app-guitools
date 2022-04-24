/**
 * simple css helper to disable buttons/inputs
 * @param disable
 * @returns
 */
export function disableStyle(disable: boolean) {
    return disable ? "opacity-50 cursor-not-allowed" : "";
}
