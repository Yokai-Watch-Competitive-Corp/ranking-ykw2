import { APIError } from "./index";

/**
 * Replace strings in any text
 */
export function replaceStrings(text: string, replace: Object): string {
    if (typeof text !== 'string')
        throw new APIError(`The text param must be a string`);
    if (replace && (typeof replace !== "object" || Array.isArray(replace)))
        throw new APIError(`The replace param must be a object`);

    for (let placeholder of Object.keys(replace)) {
        text = text.replaceAll(placeholder, replace[placeholder]);
    }

    return text;
}