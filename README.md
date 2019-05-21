# unnatural

Unnatural is a collection of Typescript types which take advantage of a dubiously legitimate compiler feature to provide an industry-grade solution to a problem that no one really has: performing numerical operations at the type level. More generally, Unnatural demonstrates a technique for working with recursive types that allows us to create a consistent user-facing API independent of limitations imposed by the TypeScript compiler.

## what?
```typescript
import {NatNum} from 'unnatural/big'

type X = NatNum<156>
type Y = NatNum<246>

type T0 = Size<X>                                 // 156
type T1 = Size<Y>                                 // 246
type T2 = IsEq<Add<X, Y>, Add<Y, X>>              // true
type T3 = Size<Div<Add<X, Y>, X>>                 // 2
type T4 = Size<Mod<Add<X, Y>, X>>                 // 90
type T5 = IsOdd<T2>                               // false
type T6 = IsSize<Mul<Sub<Y, X>, NatNum<2>>, 180>  // true
```

```
type I = Indices<['a', 1, true]>  // 0 | 1 | 2
```

## why?


## big and small numbers
It's a well established fact that some numbers are big, while other numbers are small. It follows that unnatural should provide modules to support both big and small numbers.

Small numbers work pretty 
```typescript
import {NN} from 'unnatural/small'

type T0 = Size<NN<1>>  // 1
type T1 = Size<NN<14>> // 14
type T2 = Size<NN<33>> // 33
```

```typescript
type T3 = Mul<NN<5>, NN<4>> // Error
type T4 = NN<41>;           // Error

```
For TS3.0 to TS3.3, we'll get the  error TS502: '0' is referenced directly or indirectly in its own type annotation.
// with TS3.4: error TS502: Type instantiation is excessively deep and possibly infinite.


## under the hood
 Pierre-Antoine Mills's excellent article [How to master advanced TypeScript patterns](https://medium.freecodecamp.org/typescript-curry-ramda-types-f747e99744ab).

```typescript
/**
 * Add two Nats.
 */
export type Add<X extends Nat, Y extends Nat> = {
  0: Add<Dec<X>, Inc<Y>>;
  1: Y;
  2: X;
}[If<IsZero<X>, 1, If<IsZero<Y>, 2, 0>>];
```


```typescript
/**
 * Add two Nats. At least one Nat must have a size less than or equal to 256 or C*32.
 */
export type Add<X extends Nat, Y extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  If<IsGTE<X, Y>, Trampoline<[X, Y], C>, Trampoline<[Y, X], C>>;

/* Incremental recursion for Add.
 * param Args - a tuple of Nats [X, Y].
 */
type Bounce<Args, C extends number> = Args extends [infer X, infer Y] ?
  {
    0: Bounce<[Inc<X>, Dec<Y>], DecNum<C>>;
    1: {done: false; val: [X, Y]};
    2: {done: true; val: X};
  }[
    If<IsZero<Y>, 2,
    If<IsMaxDepth<C>, 1,
    0>>
  ] : never;

// ===== Recursive helpers =====//

type Trampoline<Args, C extends number> =
    Bounce8<{done: false; val: Args}, C> extends infer T1 ?
    Bounce8<T1, C> extends infer T2 ?
    Bounce8<T2, C> extends infer T3 ?
    Bounce8<T3, C> extends {done: infer D; val: infer V} ?
    D extends true ? V : unknown : never : never : never : never;

type Bounce8<T0, C extends number> =
    Bounce1<T0, C> extends infer T1 ?
    Bounce1<T1, C> extends infer T2 ?
    Bounce1<T2, C> extends infer T3 ?
    Bounce1<T3, C> extends infer T4 ?
    Bounce1<T4, C> extends infer T5 ?
    Bounce1<T5, C> extends infer T6 ?
    Bounce1<T6, C> extends infer T7 ?
    Bounce1<T7, C> : never : never : never : never : never : never : never;

type Bounce1<T0, C extends number> =
    T0 extends {done: infer D; val: infer V} ? D extends true ? T0 : Bounce<V, C> : never;
```
