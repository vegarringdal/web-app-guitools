import { serviceStateController } from "../state/serviceStateController";
import { generateExcelCallbackEvents } from "./generateExcel";

/**
 * helper for gui part of then work
 * this will call state so dialogs will be updated
 * make copy of file if you need to make edits
 * @param event
 */
export function generateExcelCallback(event: generateExcelCallbackEvents) {
    switch (event.type) {
        case "error":
            serviceStateController.setState({
                errorDialogActivated: true,
                errorDialogHeader: event.header,
                errorDialogContent: event.content
            });
            break;
        case "info":
            serviceStateController.setState({
                loadingDataDialogActived: true,
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
