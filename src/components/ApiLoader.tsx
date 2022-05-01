import { dataControllerType, getDataControllerByName, loadDataController } from "../";
import { useState } from "react";

export function ApiLoader(props: { controllerName: string; callback: (controller: dataControllerType) => any }) {
    const [reload, setReload] = useState(true);
    const controller = getDataControllerByName(props.controllerName);

    if (!controller.gridInterface) {
        setTimeout(() => {
            loadDataController(props.controllerName).then(() => {
                setReload(reload ? false : true);
            });
        });
    } else {
        return props.callback(controller);
    }
    return null;
}
