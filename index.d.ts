
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

/**
 * Represents all the known keys of an object type `T`. This is useful when 
 * you want to work with keys that are explicitly defined in the type, rather 
 * than inferred keys.
 */
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

/**
 * This type represents the value returned by a previous function, to be set in an object of type `Obj`.
 */
export type SetValueByPath<ReturnValue, Obj extends Record<any, any>> = <T = Obj, Path extends string = Paths<T, 4>> (path: Path, value: TypeFrom<T, Path>, fromObject?: Obj) => ReturnValue;

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
/**
 * This type can be used to extract all the properties from an interface or type definition (or inferred type from an object), excluding all the properties that are functions.
 * 
 * @example
 * ```ts
 * interface IExample {
 *   a: () => void;
 *   b: (a: number) => void;
 *   c: number;
 * }
 * type Example = PropertiesFrom<IExample>; // {c: number}
 * ```
 */
export type RemoveFunctionsFrom<T> = { [P in keyof T as T[P] extends Function ? never : P]: T[P] };


export type DeepPartialObj<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
}
export interface DeepPartialArray<A> extends Array<DeepPartial<A>> { }
/** Recursively maps each element of `T` to a partial version of itself.
 * 
 * The same implementation from Matt Pocock video [https://www.youtube.com/watch?v=AhzjPAtzGTs](https://www.youtube.com/watch?v=AhzjPAtzGTs)
 */
export type DeepPartial<T> = T extends Function
    ? T
    : T extends Array<infer AItem>
    ? DeepPartialArray<AItem>
    : T extends object
    ? DeepPartialObj<T>
    : T | undefined;

/**Easier way to create non-labeled tuples when you need to repeat the same type multiple times.
 * @example
 * ```ts
 * type MyTuple = Tuple<string, 3>; // [string, string, string]
 * type MyTuple2 = Tuple<{name: string}, 2>; // [{name: string}, {name: string}]
 * ```
 */
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;

/**
 * Same as `Tuple` type, but all the elements are optional.
 */
export type OptionalTuple<T, N extends number> = Partial<Tuple<T, N>>;

/**
 * Use this type to create a new type that has the same properties as the given type, but only where the property name start's with the given string.
 * @example
 * ```ts
 *  interface IExample {
 *      address: string;
 *      city: string;
 *      at: Date;
 *  }
 * type Example = StartsWith<IExample, "a">; // {address: string, at: Date}
 * type ExampleKeys = keyof StartsWith<IExample, "a">; // "address" | "at"
 * type Example2 = StartsWith<IExample, "ad">; // {address: string}
 * ```
 */
export type StartsWith<T, K extends string> = {
    [P in keyof T as P extends `${K}${string}` ? P : never]: T[P]
};

/** 
 * Use this type to create a new type that has the same properties as the given type, but only where the property name ends with the given string.
 * @example
 * ```ts
 * interface IExample {
 *     address: string;
 *    city: string;
 *   at: Date;
 * }
 * type Example = EndsWith<IExample, "ss">; // {address: string}
 * type ExampleKeys = keyof EndsWith<IExample, "ss">; // "address"
 * type Example2 = EndsWith<IExample, "y">; // {city: string}
 * ```
 * */
export type EndsWith<T, K extends string> = {
    [P in keyof T as P extends `${string}${K}` ? P : never]: T[P]
}

/**
 * Use this type to create a new type that has the same properties as the given type, but only where the property name includes the given string.
 * @example
 * ```ts
 *  interface IExample {
 *     address: string;
 *     city: string;
 *     at: Date;
 * }
 * type Example = Includes<IExample, "it">; // {city: string}
 * type ExampleKeys = keyof Includes<IExample, "it">; // "city"
 * type Example2 = Includes<IExample, "dd">; // {address: string}
 * ```
 * */
export type Includes<T, K extends string> = {
    [P in keyof T as P extends `${string}${K}${string}` ? P : never]: T[P]
};

/**
 * Use this type to create a new type that has the same properties as the given type, but only where the property name does not include the given string.
 * @example
 * ```ts
 * interface IExample {
 *   address: string;
 *   city: string;
 *   at: Date;
 * }
 * type Example = NotIncludes<IExample, "it">; // {address: string, at: Date}
 * type ExampleKeys = keyof NotIncludes<IExample, "it">; // "address" | "at"
 * type Example2 = NotIncludes<IExample, "dd">; // {city: string, at: Date}
 * ```
 * */
export type NotIncludes<T, K extends string> = {
    [P in keyof T as P extends `${string}${K}${string}` ? never : P]: T[P]
};

/**
 * Identity utility type. This type receives `T` and returns the exact same type.
 * It is mainly used to force TypeScript to evaluate a type.
 *
 * @template T The original type
 */
export type Identity<T> = { [P in keyof T]: T[P] }

/**
 * Replace utility type. This type takes three type parameters: 
 * `T` (an object), `K` (a key in `T`), and `TReplace` (the new type for the property `K` in `T`).
 * 
 * The `Replace` type uses the `Identity` utility type to force TypeScript to 
 * evaluate the object type with the replaced property type. 
 * 
 * First, it picks all properties from `T` except `K` using `Pick<T, Exclude<keyof T, K>>`. 
 * Then, it adds the new property type for `K` using `{ [P in K] : TReplace }`. 
 * The `Identity` utility type makes TypeScript evaluate this object type immediately.
 *
 * @template T The original type
 * @template K The property key in T which the type should be replaced
 * @template TReplace The new type for the property K
 */
export type ReplaceKeyValue<T, K extends keyof T, TReplace> = Identity<Pick<T, Exclude<keyof T, K>> & { [P in K]: TReplace }>


/**
 * The `ReplaceKey` utility type can be used to change the key (property name) in an interface or type definition (or inferred type from an object) while keeping the same value type. 
 *
 * @template T The original type
 * @template K The key that you want to replace
 * @template KNew The new key that you want to use
 * 
 * @example
 * 
 * interface IExample {
 *   name: string;
 *   age: number;
 * }
 *
 * type ReplacedKeyExample = ReplaceKey<IExample, 'name', 'firstName'>;
 * // ReplacedKeyExample = { firstName: string; age: number; }
 */
 export type ReplaceKey<T, K extends keyof T, NewKey extends string> = Identity<
    Pick<T, Exclude<keyof T, K>> & { [P in NewKey]: T[K] }
>;

/**
 * Use this type to create a new type that has the same properties as the given type, but only where the property name does not start with the given string.
 * @example
 * ```ts
 * interface IExample {
 *   apple: string;
 *   banana: string;
 *   berry: string;
 *   cherry: string;
 * }
 * type Example = NotStartsWith<IExample, "b">; // {apple: string, cherry: string}
 * type ExampleKeys = keyof NotStartsWith<IExample, "b">; // "apple" | "cherry"
 * ```
 * */
export type NotStartsWith<T, K extends string> = {
    [P in keyof T as P extends `${K}${string}` ? never : P]: T[P]
};

/**
 * Use this type to create a new type that has the same properties as the given type, but only where the property name does not end with the given string.
 * @example
 * ```ts
 * interface IExample {
 *   name: string;
 *   game: string;
 *   fame: string;
 *   lane: number;
 * }
 * type Example = NotEndsWith<IExample, "me">; // {name: string, lane: number}
 * type ExampleKeys = keyof NotEndsWith<IExample, "me">; // "name" | "lane"
 * ```
 * */
export type NotEndsWith<T, K extends string> = {
    [P in keyof T as P extends `${string}${K}` ? never : P]: T[P]
};