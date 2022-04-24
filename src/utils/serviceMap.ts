import { Service } from "./service";

export const serviceMap = new Map<string, Service>();

export function getService(name: string) {
    if (!serviceMap.has(name)) {
        // should never happen, so throw error
        throw "missing service name: " + name;
    }
    return serviceMap.get(name) as Service;
}

export function setService(name: string, service: Service) {
    serviceMap.set(name, service);
}
