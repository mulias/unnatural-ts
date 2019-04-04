import {Nat} from '../Nat';
import {IsZero, Inc, Dec} from '../unsafe';
import {If, IsMaxDepth, DecNum} from '../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Construct a type that conforms to any tuple that is the same size as N or
 * larger. The size of N must be less than or equal to 256, or C*32. Note that
 * the resulting type is not a Nat, and will break if used as one.
 *
 * TupleGTE<NN<3>> = [any, any, any, ...any[]]
 * NN<5> extends TupleGTE<NN<3>> ? true : false = true
 * NN<2> extends TupleGTE<NN<3>> ? true : false = false
 */
export type TupleGTE<N extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  If<IsZero<N>, Nat,
  Trampoline<[Dec<N>, [any, ...any[]]], C>>;

/* Incremental recursion for TupleGTE.
 *
 * param Args - a tuple [N, T] where N is a Nat and T is a generic tuple type.
 */
type Bounce<Args, C extends number> = Args extends [infer N, infer T] ?
  {
    0: Bounce<[Dec<N>, Inc<T>], DecNum<C>>;
    1: {done: false; val: [N, T]};
    2: {done: true; val: T};
  }[
    If<IsZero<N>, 2,
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
