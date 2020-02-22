import {Nat} from '../Nat';
import {If} from '../../Logic';
import {Size, Inc, IsGTE} from '../unsafe';
import {IsMaxDepth, DecNum} from '../../helpers';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Given two Nats X and Y, construct the union type of numbers ranging from
 * Size<X> (inclusive) to Size<Y> (exclusive). If X is greater than or equal to
 * Y then no range is possible and the return is never. The difference between
 * X and Y must be less than or equal to 256 or C*32.
 *
 * NumsInRange<NN<3>, NN<7>> = 3 | 4 | 5 | 6
 * NumsInRange<Zero, Zero> = never
 * NumsInRange<NN<5>, NN<5>> = never
 * NumsInRange<NN<8>, NN<5>> = never
 */
export type NumsInRange<X extends Nat, Y extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  Trampoline<[X, Y, never], C>;

/* Incremental recursion for NumsInRange.
 *
 * param Args: a tuple [X, Y, R] where:
 * - X is a Nat and marks the lower bound or the range to add to R.
 * - Y is a Nat and marks the upper bound of the range. Y does not change
 *   between iterations.
 * - R is the result, either never or a union of number literals.
 */
type Bounce<Args, C extends number> = Args extends [infer X, infer Y, infer R] ?
  {
    0: Bounce<[Inc<X>, Y, R | Size<X>], DecNum<C>>;
    1: {done: false; val: [X, Y, R]};
    2: {done: true; val: R};
  }[
    If<IsGTE<X, Y>, 2,
    If<IsMaxDepth<C>, 1,
    0>>
  ] : never;

// ===== Recursive helpers =====//

type Trampoline<Args, C extends number> =
    Bounce8<{done: false; val: Args}, C> extends infer T1 ?
    Bounce8<T1, C> extends infer T2 ?
    Bounce8<T2, C> extends infer T3 ?
    Bounce8<T3, C> extends {done: infer D; val: infer V} ?
    D extends true ? V : undefined : never : never : never : never;

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
