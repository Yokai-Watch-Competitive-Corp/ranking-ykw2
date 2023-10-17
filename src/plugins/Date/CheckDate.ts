import * as modules from "../../structures/point";

console.log(modules);
console.log("hola")

// interface Schema {
//     mustBeOlderThan?: Date | number;
//     mustBeNewerThan?: Date | number;
// }

// function CheckDate(date: Date | number, schema: Schema) {
//     date = new Date(date);

//     let {mustBeNewerThan, mustBeOlderThan} = schema;
    
//     if (mustBeOlderThan) {
//         mustBeOlderThan = new Date(mustBeOlderThan);

//         if (date.getTime() > mustBeOlderThan.getTime())
//             throw new Error(`The date ${date} must be older than ${mustBeOlderThan}`);
//     }

//     if (mustBeNewerThan) {
//         mustBeNewerThan = new Date(mustBeNewerThan);

//         if (date.getTime() < mustBeNewerThan.getTime())
//             throw new Error(`The date ${date} must be newer than ${mustBeNewerThan}`);
//     }
    
//     return true;
// }

// export default new Plugin<typeof CheckDate>({
//     name: 'CheckDate',
//     categories: ["miscellaneous", "route", "middleware"],
//     source: CheckDate
// });
export default ""