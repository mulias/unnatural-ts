import {Assert} from '../src/Assert';
import {And, Or, Not, If, Cond, AllPass, AnyPass} from '../src/Logic';
import {IsExact} from '../src/Compare';

// And
type T000 = Assert<And<true, true>, true>;
type T001 = Assert<And<false, true>, false>;
type T002 = Assert<And<true, false>, false>;
type T003 = Assert<And<false, false>, false>;

// Or
type T010 = Assert<Or<true, true>, true>;
type T011 = Assert<Or<false, true>, true>;
type T012 = Assert<Or<true, false>, true>;
type T013 = Assert<Or<false, false>, false>;

// Not
type T020 = Assert<Not<true>, false>;
type T021 = Assert<Not<false>, true>;

// If
type T030 = Assert<IsExact<If<true, 0, 1>, 0>, true>;
type T031 = Assert<IsExact<If<false, 0, 1>, 1>, true>;

// Cond
type T040 = Assert<IsExact<Cond<[]>, undefined>, true>;
type T041 = Assert<IsExact<Cond<[
  [false, 0], [false, 1], [true, 'wow!']
]>, 'wow!'>, true>;

// AllPass
type T050 = Assert<AllPass<[true, true, true, true]>, true>;
type T051 = Assert<AllPass<[true, true, false, true]>, false>;
type T052 = Assert<AllPass<[true, boolean]>, false>;

// AnyPass
type T060 = Assert<AnyPass<[false, true, false, false]>, true>;
type T061 = Assert<AnyPass<[false, false, false, false]>, false>;
type T062 = Assert<AnyPass<[false, boolean]>, true>;
