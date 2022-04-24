export type getApiInfoCallbackEvents = {
    type: "info" | "done" | "error";
    content: string | null;
    header: string | null;
};
