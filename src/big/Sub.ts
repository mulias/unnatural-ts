import {Nat, Zero} from '../Nat';
import {IsZero, IsLTE, Dec} from '../unsafe';
import {If, Or, IsMaxDepth, DecNum} from '../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Calculate `X - Y` for two Nat. At least one Nat must have a size less than
 * 256, or C*32.
 *
 * Sub<NN<4>, Zero> = NN<4>
 * Sub<NN<10>, NN<4>> = NN<6>
 * Sub<NN<128>, NN<128>> = Zero
 */
export type Sub<X extends Nat, Y extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  If<IsLTE<X, Y>, Zero, Trampoline<[X, Y], C>>;

/* Incremental recursion for Sub.
 *
 * param Args - a tuple of Nats [X, Y].
 */
type Bounce<Args, C extends number> = Args extends [infer X, infer Y] ?
  {
    0: Bounce<[Dec<X>, Dec<Y>], DecNum<C>>;
    1: {done: false; val: [X, Y]};
    2: {done: true; val: X};
  }[
    If<Or<IsZero<X>, IsZero<Y>>, 2,
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
