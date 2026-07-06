// src/utils/createPageUrl.js

export function createPageUrl(pageName) {
    switch (pageName) {
        case "Home":
            return "/";
        case "Visualization":
            return "/visualization";
        case "Alerts":
            return "/alerts";
        default:
            return "/";
    }
}
