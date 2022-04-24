import { serviceStateController } from "../state/serviceStateController";
import { serviceCallbackEvents } from "./service";

/**
 * helper for gui part of then work
 * this will call state so dialogs will be updated
 * make copy of file if you need to make edits
 * @param event
 */
export function serviceCallback(event: serviceCallbackEvents) {
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
