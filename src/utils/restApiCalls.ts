// active rest api is really just a way to stop dialog from closing
// service does a lot of different calls, and all use serviceStateController, and noone know about the other
// if we dont check this we will just end up with dialog closing when we dont want it to
let activeRestApi = 0;

export function isServiceRestApiActive() {
    return activeRestApi > 0;
}

export function restApiCallStart() {
    activeRestApi++;
}

export function restApiCallEnd() {
    activeRestApi--;
}
