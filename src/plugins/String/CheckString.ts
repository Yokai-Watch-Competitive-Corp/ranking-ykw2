import { Plugin } from "../../structures/point";
const haveUpperCase = (string: string) => /[A-Z]/gm.test(string);
const haveLowerCase = (string: string) => /[a-z]/gm.test(string);
const haveSpecialChars = (string: string) => /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(string);
const haveNumbers = (string: string) => /[0-9]/gm.test(string);
const formatTypes = ["LowerCase", "UpperCase", "both", "any"];
const mustIncludeTypes = ["numbers", "SpecialChars"];

interface Schema {
    format?: "LowerCase" | "UpperCase" | "both" | "any";
    mustInclude?: ["numbers" | "SpecialChars"];
    maxLength?: number;
    minLength?: number;
}

type CheckString = (string: string, schema: Schema) => boolean;

function CheckString(string: string, schema: Schema) {
    if (typeof string !== 'string')
        throw new Error(`The given string is not a string. Typeof: ${typeof string}`);

    let {format, mustInclude, maxLength, minLength} = schema;

    if (maxLength || minLength) {
        if (maxLength && typeof maxLength !== 'number')
            throw new Error(`The "maxLength" property in the schema isn't a number. Typeof: ${typeof maxLength}`);
        if (minLength && typeof minLength !== 'number')
            throw new Error(`The "minLength" property in the schema isn't a number. Typeof: ${typeof minLength}`);

        if (minLength && string.length < minLength)
            throw new Error(`The string must be longer than ${minLength} chars`);
        if (maxLength && string.length > maxLength)
            throw new Error(`The string must be less than ${maxLength} chars`);
    }

    if (!formatTypes.includes(format)) format = "any";
    if (format == 'LowerCase' && !haveLowerCase(string))
        throw new Error(`The given string is not a lower case string: ${string}`);
    if (format == 'UpperCase' && !haveUpperCase(string))
        throw new Error(`The given string is not a upper case string: ${string}`);
    if (format == 'both' && (!haveUpperCase(string) || !haveLowerCase(string)))
        throw new Error(`The given string must have upper and lower case: ${string}`);
    
    if (mustInclude) {
        if (!Array.isArray(mustInclude))
            throw new Error(`The "mustInclude" property in the schema isn't an array. Typeof: ${typeof mustInclude}`);
        
        for (let option of mustInclude) {
            if (!mustIncludeTypes.includes(option))
                throw new Error(`An option in the "mustInclude" of ${string} isn't a real option: ${option}`);
            
            if (option == 'numbers' && !haveNumbers(string))
                throw new Error(`The given string must have numbers: ${string}`);
            if (option == 'SpecialChars' && !haveSpecialChars(string))
                throw new Error(`The given string must have special chars: ${string}`);
        }
    }

    return true;
}

export default new Plugin<CheckString>({
    name: "CheckString",
    categories: ["miscellaneous", "route", "middleware"],
    source: CheckString
});