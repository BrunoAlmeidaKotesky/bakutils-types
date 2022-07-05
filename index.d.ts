
//https://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types
export type RemoveIndex<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P]
};

//https://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types
export type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never;

//https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object */
export type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;
export type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ...0[]]

//https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T] : ""
//https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object
export type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";

/**
 * This type can be used to capture a type from an interface or type definition (or inferred type from an object) from a specific key inside that interface, given it's path.
 */
export type TypeFrom<T, Path extends string = Paths<T, 4>> =
    string extends Path ? unknown :
    Path extends keyof T ? T[Path] :
    Path extends `${infer K}.${infer R}` ? K extends keyof T ? TypeFrom<T[K], R> : unknown :
    unknown;

export type SetValueByPath<ReturnValue, Obj extends Record<any, any>> = <T = Obj, Path extends string = Paths<T, 4>> (path: Path, value: TypeFrom<T, Path>, fromObject?: Obj) => ReturnValue;
export type SetValuesByPath<ReturnValue, Obj extends Record<any, any>> = <T = Obj, Path extends string = Paths<T, 4>> (keyValues: Array<{key: Path, value: TypeFrom<T, Path>}>, fromObject?: Obj)  => ReturnValue;