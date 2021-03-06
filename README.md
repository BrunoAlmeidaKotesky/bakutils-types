A `TypeScript` library, containing some very useful and advanced types for general purpose. Such as object manipulation with high inference.

**Notes**:
- This documentation is the same from my other library `trentim-react-sdk` on Storybook, which uses this library.
-  The documentation for the types `SetValuesByPath`, `SetValuesByPath` is not available yet.
- To use this types, TypeScript version should at least be at version `4.2`


##### Installation:

`npm install --save bakutils-types` or `yarn add bakutils-types`.

##### Available types:
- [RemoveIndex](#removeindex)
- [Join](#join)
- [Paths](#paths)
- [TypeFrom](#typefrom)
- [Split](#split)
- [FunctionsFrom](#functionsfrom)
- [Leaves](#leaves)
- [SetValueByPath](#setvaluebypath)
- [SetValuesByPath](#setvaluesbypath)

## Guide:
#### RemoveIndex:

The `RemoveIndex` type can be used to remove any index key inside an interface or type definition.

*Example:*

```ts dark
interface IDynamic {
    [key: string]: any;
    Id: number;
}

type WithoutDynamicKey = RemoveIndex<IDynamic>; //Equals to: type WithoutDynamicKey = { Id: number; }
let invalid: WithoutDynamicKey = {Id: 1, K: 2}; //Will raise an error: Object literal may only specify known properties, and 'K' does not exist in type 'RemoveIndex<IDynamic>'.
let valid: WithoutDynamicKey = {Id: 2};
```

#### Join:

On the most basic level, the `Join` type basically just join two string types together.
But this type is very useful when used on more advanced scenarios, like when using recursively on another types, such as `Paths` and `Leaves` type.

*Example:*
```ts dark
type A = Join<'a', 'b.c'> //Equals to: "a.b.c"
type B = Join<'a', ''> //Equals to: "a"
```

#### Paths:

One of the most advanced types in this library is the `Paths` type, which can be used to recursively create a known collection of paths from a given object.
It does have a limit for how deep it can be, especially described by the internal `Prev` tuple type.

*Example:*

```ts dark	
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

/*A limit to how deep you can go in your object, since the type system may not able to handle it.
Generally, you can use 4 (or more) as the default value. It only becomes a problem when you have a unknown level of nesting.
*/
type ExamplePaths = Paths<IExample, 4>; // "data" | "data.id" | "data.userInfo" | "data.userInfo.name" | "data.userInfo.address" | "data.userInfo.address.street" | "data.userInfo.address.city"
```

#### Leaves
This type is just like [Paths](#paths) type, but it does not point to object types itself, only properties inside of them.

```ts dark
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
type ExLeaves = Leaves<IExample> /* "data.id" | "data.userInfo.name" | 
"data.userInfo.address.street" | "data.userInfo.address.city"*/
```

#### TypeFrom:

This is probably one of the most advanced utility type possible in this library.
It can be used to capture a type from an interface or type definition (or inferred type from an object) from a specific key inside that interface, given it's path.

*Example:*

On the following example, we create two interfaces, `IExample` and `IUserInfo`, a type for `userInfo` property.
Using `TypeFrom<IExample>` without any second type parameter, will give us all the possible types from the `IExample` interface. 
If we do not provide a second type parameter, it will use `Paths<T, 4>` by default to capture all the paths.
Except, if we do provide a second type parameter, it will capture the type from that path inside the interface.
Unfortunately, it's not possible to automatically infer the type from the path given it's first type parameter, so we need to provide it manually.

```ts dark
interface IUserInfo {
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
*/
```

#### Split
Use this type to split strings into an array of strings, using the given separator.

*Example:*
```ts dark
type MyType = Split<"a.b.c", ".">; // ["a", "b", "c"]
```

#### FunctionsFrom
This type can be used to extract all the functions from an interface or type definition (or inferred type from an object), excluding all the properties that are not functions.

*Example:*
```ts dark
interface IExample {
  a: () => void;
  b: (a: number) => void;
  c: number;
}
type Example = FunctionsFrom<IExample>; // {a: () => void, b: (a: number) => void}
```

#### SetValueByPath
Documentation not written yet.


#### SetValuesByPath
Documentation not written yet.

##### Thanks to:
- [How to remove index signature using mapped types](https://stackoverflow.com/questions/51465182/how-to-remove-index-signature-using-mapped-types)
- [Typescript: deep keyof of a nested object](https://stackoverflow.com/questions/58434389/typescript-deep-keyof-of-a-nested-object)
- Official TypeScript team.