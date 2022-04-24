export type serviceCallbackEvents = {
    type: "done" | "info" | "error";
    content: string | null;
    header: string | null;
    loadingDataRuntimeMilliseconds?: number | null;
    loadingDataReplyMilliseconds?: number | null;
    loadingDataRowCount?: number | null;
};
