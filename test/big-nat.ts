import {
  Nat, Zero, Size, Inc, Dec, IsSize, IsEq, Max, Min, NN, Add, Sub, Mul,
  Div, Mod, IsEven, IsOdd, NumsInRange, Indices, StringToNat, TupleGTE
} from '../src/Nat/big';
import {Assert} from '../src/Assert';
import {IsUnknown, IsNever, IsExact} from '../src/Compare';

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
type NN64 = NN<64>;
type NN128 = NN<128>;
type NN256 = NN<256>;
type NN512 = NN<512, 16>;

// Zero
type T000 = Assert<IsExact<Zero, []>, true>;
type T001 = Assert<IsExact<NN<0>, Zero>, true>;
type T002 = Assert<IsExact<NN1, Inc<Zero>>, true>;
type T003 = Assert<IsSize<Zero, 0>, true>;

// NatNum
type T010 = Assert<IsSize<NN<0>, 0>, true>;
type T011 = Assert<IsSize<NN3, 3>, true>;
type T012 = Assert<IsSize<NN256, 256>, true>;
type T013 = Assert<IsUnknown<NN<257>>, true>;
type T014 = Assert<IsUnknown<NN<number>>, true>;
type T015 = Assert<IsUnknown<NN<-1>>, true>;
type T016 = Assert<IsSize<NN<257, 9>, 257>, true>;
type T017 = Assert<IsSize<NN512, 512>, true>;

// Add
type T020 = Assert<IsEq<Add<Zero, Zero>, Zero>, true>;
type T021 = Assert<IsSize<Add<NN256, NN256>, 512>, true>;
type T022 = Assert<IsSize<Add<NN3, Zero>, 3>, true>;
type T023 = Assert<IsSize<Add<NN10, NN3>, 13>, true>;
type T024 = Assert<IsSize<Add<NN1, NN512>, 513>, true>;
type T025 = Assert<IsSize<Add<NN512, NN1>, 513>, true>;

// Sub
type T030 = Assert<IsSize<Sub<NN4, Zero>, 4>, true>;
type T031 = Assert<IsSize<Sub<NN10, NN4>, 6>, true>;
type T032 = Assert<IsSize<Sub<NN128, NN128>, 0>, true>;

// Mul
type T040 = Assert<IsSize<Mul<NN5, NN3>, 15>, true>;
type T041 = Assert<IsSize<Mul<NN128, NN2>, 256>, true>;
type T042 = Assert<IsUnknown<Mul<NN128, NN3>>, true>;
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
type T05B = Assert<IsSize<Div<NN11, NN6>, 1>, true>;
type T05C = Assert<IsSize<Div<NN11, NN9>, 1>, true>;
type T05D = Assert<IsSize<Div<NN11, NN10>, 1>, true>;
type T05E = Assert<IsSize<Div<NN<50>, NN6>, 8>, true>;
type T05F = Assert<IsSize<Div<NN<50>, NN9>, 5>, true>;
type T05G = Assert<IsSize<Div<NN<50>, NN<5>>, 10>, true>;
type T05H = Assert<IsSize<Div<NN<257, 9>, NN2>, 128>, true>;

// Mod
type T060 = Assert<IsSize<Mod<NN2, NN1>, 0>, true>;
type T061 = Assert<IsSize<Mod<NN2, NN2>, 0>, true>;
type T062 = Assert<IsSize<Mod<NN<20>, NN3>, 2>, true>;
type T064 = Assert<IsSize<Mod<NN<19>, NN5>, 4>, true>;
type T065 = Assert<IsSize<Mod<NN11, NN7>, 4>, true>;
type T066 = Assert<IsSize<Mod<NN<251>, NN<12>>, 11>, true>;

// IsEven
type T070 = Assert<IsEven<Zero>, true>;
type T071 = Assert<IsEven<NN11>, false>;

// IsOdd
type T080 = Assert<IsOdd<NN11>, true>;
type T081 = Assert<IsOdd<NN<30>>, false>;

// Max
type T090 = Assert<IsExact<Max<NN1, NN4>, NN4>, true>;
type T091 = Assert<IsExact<Max<NN1, NN256>, NN256>, true>;

// Min
type T100 = Assert<IsExact<Min<NN7, NN4>, NN4>, true>;
type T101 = Assert<IsExact<Min<Zero, NN7>, Zero>, true>;

// NumsInRange
type T110 = Assert<IsExact<NumsInRange<NN3, NN7>, 3 | 4 | 5 | 6>, true>;
type T111 = Assert<IsNever<NumsInRange<NN4, NN1>>, true>;

// Indices
type T120 = Assert<IsExact<Indices<NN7>, 0 | 1 | 2 | 3 | 4 | 5 | 6>, true>;
type T121 = Assert<IsNever<Indices<Zero>>, true>;

// StringToNat
type T130 = Assert<IsSize<StringToNat<'0'>, 0>, true>;
type T131 = Assert<IsSize<StringToNat<'256'>, 256>, true>;
type T132 = Assert<IsUnknown<StringToNat<'257'>>, true>;
type T133 = Assert<IsUnknown<StringToNat<'wow!'>>, true>;

// TupleGTE
type T140 = Assert<Zero extends TupleGTE<Zero> ? true : false, true>;
type T141 = Assert<Zero extends TupleGTE<NN1> ? true : false, false>;
type T142 = Assert<NN<256> extends TupleGTE<Zero> ? true : false, true>;
type T143 = Assert<NN<12> extends TupleGTE<NN<12>> ? true : false, true>;
