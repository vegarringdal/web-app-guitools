import { serviceStateController } from "../state/serviceStateController";
import { getApiInfoCallbackEvents } from "./getApiInfoCallbackEvents";

export function getApiInfoCallback(event: getApiInfoCallbackEvents) {
    switch (event.type) {
        case "error":
            serviceStateController.setState({
                loadingDataDialogActived: false,
                errorDialogActivated: true,
                errorDialogHeader: event.header,
                errorDialogContent: event.content
            });
            break;
        case "info":
            serviceStateController.setState({
                loadingDataDialogActived: true,
                loadingDataRuntimeMilliseconds: 0,
                loadingDataReplyMilliseconds: 0,
                loadingDataRowCount: 0,
                loadingDataDialogHeader: event.header,
                loadingDataDialogContent: event.content
            });
            break;
        case "done":
            serviceStateController.setState({
                loadingDataDialogActived: false,
                loadingDataDialogHeader: event.header,
                loadingDataDialogContent: event.content
            });
            break;
    }
}
