import {Zero} from '../Nat';
import {If} from '../Logic';
import {Inc, NatToString} from '../unsafe';
import {IsMaxDepth, DecNum} from '../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Attempt to fine a Nat representation of the string S. Performs a linear
 * search starting with "0". If a match is not found in 256 or C*32 iterations
 * then the result is unknown.
 *
 * StringToNat<"0"> = Zero
 * StringToNat<"4"> = NN<4>
 * StringToNat<"not a num"> = unknown
 */
export type StringToNat<S extends string, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  Trampoline<[S, Zero], C>;

/* Incremental recursion for StringToNat.
 *
 * param Args: a tuple [S, N] where:
 * - S is the target string and does not change between iterations.
 * - N is a Nat.
 */
type Bounce<Args, C extends number> = Args extends [infer S, infer N] ?
  {
    0: Bounce<[S, Inc<N>], DecNum<C>>;
    1: {done: false; val: [S, N]};
    2: {done: true; val: N};
  }[
    S extends NatToString<N> ? 2 :
    If<IsMaxDepth<C>, 1,
    0>
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
