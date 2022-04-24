import { serviceStateController } from "../state/serviceStateController";
import { generateExcelCallbackEvents } from "./generateExcelCallbackEvents";

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
