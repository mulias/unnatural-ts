import {Nat, Zero} from '../Nat';
import {NumsInRange} from './NumsInRange';
import {DEFAULT_RECURSIVE_DEPTH} from './constants';

/**
 * Returns a union of all numbers that can index into the tuple T. The size of
 * T must be less than or equal to 256, or C*32.
 *
 * Indices<['a', 12, true, 9]> = 0 | 1 | 2 | 3
 * Indices<[]> = never
 */
export type Indices<T extends Nat, C extends number = DEFAULT_RECURSIVE_DEPTH> =
  NumsInRange<Zero, T, C>;
