/**
 * default api used by application-server
 * TODO: this should be part of application-common code, so I edit application-server/application at once
 */
const url = `${window.location.protocol}//${window.location.host}`;
const apiUrl = `${url}/api`;
export const httpApiConfig = {
    authRefresh_url: `${apiUrl}/authUpdate`,
    login_url: `${apiUrl}/auth`,
    api_url: apiUrl,
    info_url: `${apiUrl}/info/`,
    query_url: `${apiUrl}/query/`,
    update_url: `${apiUrl}/update/`,
    all_url: `${apiUrl}/all`
};
