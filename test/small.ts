import {
  Zero, Inc, IsSize, IsEq, Max, Min, NN, Add, Sub, Mul, Div, Mod,
  IsEven, IsOdd, NumsInRange, Indices, StringToNat, TupleGTE
} from '../src/small';
import {Assert, IsUnknown, IsNever, IsExact} from './helpers';

type NN1 = NN<1>;
type NN2 = NN<2>;
type NN3 = NN<3>;
type NN4 = NN<4>;
type NN5 = NN<5>;
type NN6 = NN<6>;
type NN7 = NN<7>;
type NN8 = NN<8>;
type NN9 = NN<9>;
type NN10 = NN<10>;
type NN11 = NN<11>;
type NN32 = NN<32>;
type NN40 = NN<40>;

// Zero
type T000 = Assert<IsExact<Zero, []>, true>;
type T001 = Assert<IsExact<NN<0>, Zero>, true>;
type T002 = Assert<IsExact<NN1, Inc<Zero>>, true>;
type T003 = Assert<IsSize<Zero, 0>, true>;

// NatNum
type T010 = Assert<IsSize<NN<0>, 0>, true>;
type T011 = Assert<IsSize<NN3, 3>, true>;
type T014 = Assert<IsUnknown<NN<number>>, true>;

// Add
type T020 = Assert<IsEq<Add<Zero, Zero>, Zero>, true>;
type T022 = Assert<IsSize<Add<NN3, Zero>, 3>, true>;
type T023 = Assert<IsSize<Add<NN10, NN3>, 13>, true>;

// Sub
type T030 = Assert<IsSize<Sub<NN4, Zero>, 4>, true>;
type T031 = Assert<IsSize<Sub<NN10, NN4>, 6>, true>;

// Mul
type T040 = Assert<IsSize<Mul<NN5, NN3>, 15>, true>;
type T043 = Assert<IsSize<Mul<NN1, Zero>, 0>, true>;
type T044 = Assert<IsSize<Mul<Zero, NN5>, 0>, true>;

// Div
type T050 = Assert<IsSize<Div<NN2, NN1>, 2>, true>;
type T051 = Assert<IsSize<Div<NN2, NN2>, 1>, true>;
type T052 = Assert<IsSize<Div<NN<20>, NN2>, 10>, true>;
type T053 = Assert<IsSize<Div<NN2, NN2>, 1>, true>;
type T054 = Assert<IsSize<Div<NN<20>, NN<10>>, 2>, true>;
type T055 = Assert<IsSize<Div<NN<20>, NN<11>>, 1>, true>;
type T056 = Assert<IsSize<Div<NN<30>, NN<4>>, 7>, true>;
type T057 = Assert<IsSize<Div<NN11, NN2>, 5>, true>;
type T058 = Assert<IsSize<Div<NN11, NN3>, 3>, true>;
type T059 = Assert<IsSize<Div<NN11, NN4>, 2>, true>;
type T05A = Assert<IsSize<Div<NN11, NN5>, 2>, true>;
type T05C = Assert<IsSize<Div<NN11, NN9>, 1>, true>;
type T05D = Assert<IsSize<Div<NN11, NN10>, 1>, true>;

// Mod
type T060 = Assert<IsSize<Mod<NN2, NN1>, 0>, true>;
type T061 = Assert<IsSize<Mod<NN2, NN2>, 0>, true>;
type T062 = Assert<IsSize<Mod<NN<20>, NN3>, 2>, true>;
type T064 = Assert<IsSize<Mod<NN<19>, NN5>, 4>, true>;
type T065 = Assert<IsSize<Mod<NN11, NN7>, 4>, true>;
type T = Mod<NN2, NN1>;

// IsEven
type T070 = Assert<IsEven<Zero>, true>;
type T071 = Assert<IsEven<NN11>, false>;

// IsOdd
type T080 = Assert<IsOdd<NN11>, true>;
type T081 = Assert<IsOdd<NN2>, false>;

// Max
type T090 = Assert<IsExact<Max<NN1, NN5>, NN5>, true>;
type T091 = Assert<IsExact<Max<NN1, Zero>, NN1>, true>;

// Min
type T100 = Assert<IsExact<Min<NN7, NN4>, NN4>, true>;
type T101 = Assert<IsExact<Min<NN10, NN7>, NN7>, true>;

// NumsInRange
type T110 = Assert<IsExact<NumsInRange<NN3, NN7>, 3 | 4 | 5 | 6>, true>;
type T111 = Assert<IsNever<NumsInRange<NN4, NN1>>, true>;

// Indices
type T120 = Assert<IsExact<Indices<NN7>, 0 | 1 | 2 | 3 | 4 | 5 | 6>, true>;
type T121 = Assert<IsNever<Indices<Zero>>, true>;

// StringToNat
type T130 = Assert<IsSize<StringToNat<'0'>, 0>, true>;
type T131 = Assert<IsSize<StringToNat<'39'>, 39>, true>;

// TupleGTE
type T140 = Assert<Zero extends TupleGTE<Zero> ? true : false, true>;
type T141 = Assert<Zero extends TupleGTE<NN1> ? true : false, false>;
type T143 = Assert<NN<12> extends TupleGTE<NN<12>> ? true : false, true>;
