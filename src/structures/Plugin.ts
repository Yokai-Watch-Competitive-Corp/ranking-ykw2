import { APIError, replaceStrings } from "../utils/index";

export interface PluginOptions {
    name: string;
    source: Function;
    categories?: Array<string>;
}

export class Plugin<src> {
    readonly name: string;
    readonly categories: Array<string> = ["miscellaneuos"];
    readonly source: src;

    constructor(options: PluginOptions) {
        let {name, source, categories = ["miscellaneous"]} = options;

        if (name.length > 25)
            throw new APIError(`The name property must not be longer than 25 characters`);

        for (let category of categories) {
            if (typeof category !== "string")
                throw new APIError(`Some categories isn't a strings`);
            if (category.length > 25)
                throw new APIError(`Some categores be longer than 25 characters`);

            categories[categories.findIndex((v) => v == category)] = replaceStrings(category, {
                '\n' : '',
                '\\s' : ''
            });
        }

        Object.defineProperties(this, {
            name: {
                enumerable: true,
                writable: false,
                value: replaceStrings(name, {
                    '\n' : '',
                    '\\s' : ''
                })
            },
            source: {
                enumerable: true,
                writable: false,
                value: source,
            },
            categories: {
                enumerable: true,
                writable: false,
                value: categories
            }
        });
    }
}