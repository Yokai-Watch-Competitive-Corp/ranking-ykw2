import { Plugin } from '../../structures/point';
import { date, string } from "../point";
const types = ["string", "array", "number", "boolean", "object", "date", "any"];
const PluginTypes = { string: string.CheckString, date: date.CheckDate };

interface CheckKeys {
    missing: boolean;
    keys: Array<string>;
}

const checkRequiredKeys = (keys: Array<string>, schema: InterfaceSchema["config"]): CheckKeys => {
    let schemaKeys = Object.keys(schema)
    let requiredKeys = schemaKeys.filter(key => schema[key]?.required && !keys.includes(key));

    return {
        missing: requiredKeys.length < schemaKeys.length ? false : true,
        keys: requiredKeys
    };
};

interface SchemaOptions {
    type?: "string" | "array" | "number" | "boolean" | "object" | "date" | "any";
    required?: boolean;
    format?: "LowerCase" | "UpperCase" | "both" | "any";
    mustInclude?: ["numbers" | "SpecialChars"];
    maxLength?: number;
    minLength?: number;
    allowDecimal?: boolean;
    mustBeOlderThan?: number;
    mustBeNewerThan?: number;
    properties?: InterfaceSchema;
}

interface InterfaceSchema {
    allowNotDefined?: "ThrowError" | "DeleteKey" | "Ignore" | boolean;
    config?: {
        [key: string]: SchemaOptions;
    }
}

type CheckObject = (object: object, schema: InterfaceSchema) => boolean;

function CheckObject(object: Object, schema: InterfaceSchema) {
    let keys = Object.keys(object);
    let {allowNotDefined} = schema;

    let check = checkRequiredKeys(keys, schema.config);
    if (check.missing) throw new Error(`Missing properties: ${check.keys.join(', ')}`);

    for (let key of keys) {
        let SchemaProps = schema.config[key];

        if (!SchemaProps) {
            if (!allowNotDefined || allowNotDefined == "ThrowError")
              throw new Error(`The key ${key} doens't exists in the schema`);
            if (allowNotDefined == 'DeleteKey')
                delete object[key];
            if (allowNotDefined == 'Ignore' || allowNotDefined) continue;
        }

        let {type} = SchemaProps;
        if (!types.includes(type)) type == 'any';

        // check all types
        if (type == 'any') continue;
        if (type == 'object') object[key] = CheckObject(object[key], SchemaProps.properties)
        else PluginTypes[type].source(object[key], SchemaProps);
    }

    return object;
}

export default new Plugin<CheckObject>({
    name: 'CheckObject',
    categories: ["miscellaneous", "route", "middleware"],
    source: CheckObject
});