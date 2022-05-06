export type generateExcelCallbackEvents = {
    type: "done" | "info" | "error";
    content: string | null;
    header: string | null;
};
