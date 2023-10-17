import { Memory } from '../structures/point';
import { APIError } from './index';

interface Options {
    objects: Object;
    storage?: Memory<string, any>;
}

/**
 * Collect all content of the files ends with .js in a small cache
 */
export default function handleObjects(options: Options): Map<string, any> {
    let {storage, objects} = options;
    let cache = storage ?? new Memory();

    for (let name of Object.keys(objects)) {
        cache.set(name, objects[name]);
    }

    return cache;
}