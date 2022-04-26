import {
    Configuration,
    PopupRequest,
    PublicClientApplication,
    EventType,
    EventMessage,
    AuthenticationResult
} from "@azure/msal-browser";

declare const AZURE_SCOPES: string;
declare const AZURE_CLIENT_ID: string;
declare const AZURE_TENDANT_ID: string;

const msalConfig: Configuration = {
    auth: {
        clientId: AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${AZURE_TENDANT_ID}/`,
        redirectUri: "/",
        postLogoutRedirectUri: "/"
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
        const payload = event.payload as AuthenticationResult;
        const account = payload.account;
        msalInstance.setActiveAccount(account);
    }
    if (event.eventType === EventType.LOGIN_FAILURE && event.payload) {
        console.log("login failure");
    }
});

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}

const loginRequest: PopupRequest = {
    scopes: AZURE_SCOPES.split(",")
};

export async function getAzureAuth() {
    const response = await msalInstance.acquireTokenSilent(loginRequest).catch(() => {
        // if error use popup
        return msalInstance.loginPopup(loginRequest);
    });

    return response;
}

export async function getAccessToken() {
    const response = await msalInstance.acquireTokenSilent(loginRequest).catch(() => {
        // if error use popup
        return msalInstance.loginPopup(loginRequest);
    });
    return response.accessToken;
}
