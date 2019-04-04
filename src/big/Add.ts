import {Nat} from '../Nat';
import {IsZero, IsGTE, Inc, Dec} from '../unsafe';
import {If, IsMaxDepth, DecNum} from '../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Add two Nats. At least one Nat must have a size less than or equal to 256
 * or C*32.
 *
 * Add<NN<4>, Zero> = NN<4>
 * Add<NN<10>, NN<4>> = NN<14>
 * Add<NN<128>, NN<128>> = NN<256>
 *
 * type NN200 = Add<NN<100>, NN<100>>
 * Size<Add<NN<128>, NN200>> = 328
 * Size<Add<NN200, NN<100>>> = 300
 * Add<NN200, NN200> = unknown
 */
export type Add<X extends Nat, Y extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  If<IsGTE<X, Y>, Trampoline<[X, Y], C>, Trampoline<[Y, X], C>>;

/* Incremental recursion for Add.
 *
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
