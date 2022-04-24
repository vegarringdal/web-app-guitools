import { ApiInterface, UserRolesInterface } from "@rad-common";

const apiConfig = new Map<string, apiType>();

export type apiType = {
    api: ApiInterface;
    allUserRoles: string[];
    apiRoles: UserRolesInterface;
    user: { userName: string; userID: string };
};

export function getApiConfig(name: string) {
    return apiConfig.get(name) as apiType;
}

export function setApiConfig(name: string, data: apiType) {
    apiConfig.set(name, data);
}
