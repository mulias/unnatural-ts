import {Nat, Zero} from '../Nat';
import {IsZero, IsGTE, Inc, Dec} from '../unsafe';
import {If, IsMaxDepth, DecNum} from '../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Calculate `X * Y` for two Nats. Both Nats must have a size less than or
 * equal to 256 or C*32. The resulting product must also have a size less than
 * or equal to 256 or C*32.
 *
 * Mul<NN<5>, NN<3>> = NN<15>
 * Mul<NN<1>, Zero> = Zero
 * Mul<Zero, NN<5>> = Zero
 */
export type Mul<X extends Nat, Y extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  If<IsGTE<X, Y>, Trampoline<[Dec<X>, Dec<X>, Y, Zero], C>, Trampoline<[Dec<Y>, Dec<Y>, X, Zero], C>>;

/* Incremental recursion for Mul.
 *
 * Prerequisites: For `X * Y`, X must be greater than or equal to Y.
 *
 * param Args: a tuple of Nats [XX, X, Y, Z] where:
 * - XX is the multiplier, and will not change between recursive calls.
 * - X is the counter for the inner addition loop, starting at XX, decrementing
 *   to 0, then resetting.
 * - Y is the multiplicand and the counter for the outer loop.
 * - Z is the product.
 */
type Bounce<Args, C extends number> = Args extends [infer XX, infer X, infer Y, infer Z] ?
  {
    0: Bounce<[XX, Dec<X>, Y, Inc<Z>], DecNum<C>>;
    1: Bounce<[XX, XX, Dec<Y>, Inc<Z>], DecNum<C>>;
    2: {done: false; val: [XX, X, Y, Z]};
    3: {done: true; val: Z};
  }[
    If<IsZero<Y>, 3,
    If<IsMaxDepth<C>, 2,
    If<IsZero<X>, 1,
    0>>>
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
