
/**
 * This type can be used to remove any index key inside an interface or type definition.
 * 
 * @example
 * ```ts
    interface IDynamic {
        [key: string]: any;
        Id: number;
    }

    type WithoutDynamicKey = RemoveIndex<IDynamic>; //Equals to: type WithoutDynamicKey = { Id: number; }
    let invalid: WithoutDynamicKey = {Id: 1, K: 2}; //Will raise an error: Object literal may only specify known properties, and 'K' does not exist in type 'RemoveIndex<IDynamic>'.
    let valid: WithoutDynamicKey = {Id: 2};
 * ```*/
export type RemoveIndex<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P]
};

//https://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types
export type KnownKeys<T> = {
    [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never;

/**
On the most basic level, the `Join` type basically just join two string types together.
But this type is very useful when used on more advanced scenarios, like when using recursively on another types, such as `Paths` and `Leaves` type.

@example
```ts
type A = Join<'a', 'b.c'> //Equals to: "a.b.c"
type B = Join<'a', ''> //Equals to: "a"
```
 */
export type Join<K, P> = K extends string | number ?
    P extends string | number ?
    `${K}${"" extends P ? "" : "."}${P}`
    : never : never;
/**This is an internal type for controlling the `Paths` type. It has no use besides that. */
export type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, ...0[]]

/**
 * It can be used to recursively create a known collection of paths from a given object.
 * 
 * It does have a limit for how deep it can be, especially described by the internal `Prev` tuple type, as it's second type parameter.
 * 
 * ```ts
 * interface IExample {
    data: {
        id: number;
        userInfo: {
            name: string;
            address: {
                street: string;
                city: string;
            }
        }
    }
}
type ExamplePaths = Paths<IExample, 4>; // "data" | "data.id" | "data.userInfo" | "data.userInfo.name" | "data.userInfo.address" | "data.userInfo.address.street" | "data.userInfo.address.city"
```
*/
export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: K extends string | number ?
        `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never
    }[keyof T] : ""
/**
 * This type is just like `Paths` type, but it does not point to object types itself, only properties inside of them.
    @example
    ```ts
    interface IExample {
    data: {
        id: number;
        userInfo: {
            name: string;
            address: {
                street: string;
                city: string;
            }
        }
    }
}
type ExLeaves = Leaves<IExample> //"data.id" | "data.userInfo.name" | "data.userInfo.address.street" | "data.userInfo.address.city"
```*/
export type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
    { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";

/**
 * This type can be used to capture a type from an interface or type definition (or inferred type from an object) from a specific key inside that interface, given it's path.
 * 
 * @example
 * ```ts
 * interface IUserInfo {
    name: string;
    address: {
        street: string;
        city: string;
        houseNumber: number;
    }
}
interface IExample {
    data: {
        id: number;
        userInfo: IUserInfo;
    }
}

type AllExampleTypes = TypeFrom<IExample>;
type ExampleUserInfo = TypeFrom<IExample, "data.userInfo">;
type ExampleHouseNumberType = TypeFrom<IExample, 'data.userInfo.address.houseNumber'>;
type UnknownType = TypeFrom<IExample, 'data.userInfo.propertyDoesNotExist'>;

/*Returns:
AllExampleTypes = string | number | {
    id: number;
    userInfo: IUserInfo;
} | IUserInfo | {
    street: string;
    city: string;
    houseNumber: number;
}
ExampleUserInfo = IUserInfo
ExampleHouseNumberType = number
UnknownType = unknown
 * ```*/
export type TypeFrom<T, Path extends string = Paths<T, 4>> =
    string extends Path ? unknown :
    Path extends keyof T ? T[Path] :
    Path extends `${infer K}.${infer R}` ? K extends keyof T ? TypeFrom<T[K], R> : unknown :
    unknown;

export type SetValueByPath<ReturnValue, Obj extends Record<any, any>> = <T = Obj, Path extends string = Paths<T, 4>> (path: Path, value: TypeFrom<T, Path>, fromObject?: Obj) => ReturnValue;
export type SetValuesByPath<ReturnValue, Obj extends Record<any, any>> = <T = Obj, Path extends string = Paths<T, 4>> (keyValues: Array<{ key: Path, value: TypeFrom<T, Path> }>, fromObject?: Obj) => ReturnValue;

/**
 * Use this type to split strings into an array of strings, using the given separator.
 * @example
 * ```ts
 * type MyType = Split<"a.b.c", ".">; // ["a", "b", "c"]
 * ```
 */
export type Split<Str extends string, By extends string> =
    string extends Str ? string[] :
    Str extends '' ? [] :
    Str extends `${infer T}${By}${infer U}` ? [T, ...Split<U, By>] : [Str];

/**
 * This type can be used to extract all the functions from an interface or type definition (or inferred type from an object), excluding all the properties that are not functions.
 * 
 * @example
 * ```ts
 * interface IExample {
 *   a: () => void;
 *   b: (a: number) => void;
 *   c: number;
 * }
 * type Example = FunctionsFrom<IExample>; // {a: () => void, b: (a: number) => void}
 * ```
 */
export type FunctionsFrom<T> = { [P in keyof T as T[P] extends Function ? P : never]: T[P] };