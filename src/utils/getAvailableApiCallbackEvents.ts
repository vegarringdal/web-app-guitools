export type getAvailableApiCallbackEvents = {
    type: "info" | "done" | "error";
    content: string | null;
    header: string | null;
};
