import { APIError } from "../utils/index";

export class Memory<k, v> extends Map<k, v> {
    constructor() {
        super();
    }

    filter(fn: Function) {
        if (typeof fn !== "function") 
            throw new APIError(`The param isn't a function`)

        const FILTERED_MEMORY = new Memory();
        for (let [key, value] of this) {
            if (fn({key, value, memory: this})) FILTERED_MEMORY.set(key, value);
        }

        return FILTERED_MEMORY;
    }

    some(fn: Function) {
        if (typeof fn !== "function")
            throw new APIError(`The param isn't a function`);

        for (let [key, value] of this) {
            if (fn({key, value})) return true;
        }

        return false;
    }

    random() {
        let values = [...this.values()];

        return values[Math.floor(Math.random() * values.length)];
    }
}