import {Zero} from '../Nat';
import {If} from '../../Logic';
import {IsSize, Inc} from '../unsafe';
import {IsMaxDepth, DecNum} from '../../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Construct a Nat representation of a number literal type. By default supports
 * Nats up to size 256. Passing a number to the optional param C sets the max
 * size to C*32, but may exceed the recursive stack limit or have other
 * undesired behavior.
 *
 * NatNum<0> = Zero
 * NatNum<3> = [any, any, any]
 * NatNum<256> = [any, any, ...222 more..., any, any]
 * NatNum<257> = unknown
 * NatNum<number> = unknown
 * NatNum<-1> = unknown
 * NatNum<512, 16> = [any, any, ...508 more..., any, any]
 */
export type NatNum<N extends number, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  number extends N ? unknown : Trampoline<[N, Zero], C>;

/**
 * Shorthand for NatNum.
 */
export type NN<N extends number, C extends number = DEFAULT_RECURSIVE_DEPTH> = NatNum<N, C>;

/* Incremental recursion for NatNum.
 *
 * Prerequisites: the target number N is a number literal.
 *
 * param Args - a tuple [N, T] where:
 * - N is a number literal, the target value for Size<T>.
 * - T is a Nat which starts at Zero and increments to the target size.
 * param C - Max number of recursive calls left for this bounce.
 * return - The object type {done: false; val: NextArgs} if the bounce finishes before the final value is calculated, or {done: true; val: T} if the target value of Size<T> is reached in this bounce.
 */
type Bounce<Args, C extends number> = Args extends [infer N, infer T] ?
  {
    0: Bounce<[N, Inc<T>], DecNum<C>>;
    1: {done: false; val: [N, T]};
    2: {done: true; val: T};
  }[
    If<IsSize<T, N>, 2,
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
