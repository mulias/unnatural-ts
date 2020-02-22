import {Assert} from '../src/Assert';
import {
  IsNullable, IsUnknown, IsNever, IsExact, IsAny, IsEquivalent, IsExtension
} from '../src/Compare';

// IsNullable
type T000 = Assert<IsNullable<null>, true>;
type T001 = Assert<IsNullable<undefined>, true>;
type T002 = Assert<IsNullable<any>, true>;
type T003 = Assert<IsNullable<unknown>, false>;
type T004 = Assert<IsNullable<never>, false>;
type T005 = Assert<IsNever<IsNullable<never>>, false>;

// IsExtension
type T010 = Assert<IsExtension<1, number>, true>;
type T011 = Assert<IsExtension<any, string>, true | false>;
type T012 = Assert<IsExtension<string, any>, true>;
type T013 = Assert<IsExtension<never, number>, true>;
type T014 = Assert<IsNever<IsExtension<never, number>>, false>;
type T015 = Assert<IsExtension<any, any>, true>;

// IsEquivalent
type T020 = Assert<IsEquivalent<string, string>, true>;
type T021 = Assert<IsEquivalent<string, any>, true>;
type T022 = Assert<IsEquivalent<string, unknown>, false>;
type T023 = Assert<IsEquivalent<'a', string>, false>;
type T024 = Assert<IsEquivalent<number, 1>, false>;

// IsExact
type T030 = Assert<IsExact<unknown, unknown>, true>;
type T031 = Assert<IsExact<never, never>, true>;
type T032 = Assert<IsExact<any, boolean>, false>;
type T033 = Assert<IsExact<'a', 'a' | 'b'>, false>;
type T034 = Assert<IsExact<0 | 1, 0 | 1>, true>;
type T035 = Assert<IsExact<any, any | number>, true>;
type T036 = Assert<IsExact<boolean, true>, false>;
type T037 = Assert<IsExact<false, boolean>, false>;

// IsAny
type T040 = Assert<IsAny<any>, true>;
type T041 = Assert<IsAny<never>, false>;
type T042 = Assert<IsNever<IsAny<never>>, false>;
type T043 = Assert<IsAny<unknown>, false>;
type T044 = Assert<IsAny<string>, false>;
type T045 = Assert<IsAny<any | string>, true>;

// IsNever
type T050 = Assert<IsNever<never>, true>;
type T051 = Assert<IsNever<string>, false>;
type T052 = Assert<IsNever<any>, false>;
type T053 = Assert<IsNever<unknown>, false>;
type T054 = Assert<IsNever<undefined>, false>;
type T055 = Assert<IsNever<never | number>, false>;

// IsUnknown
type T060 = Assert<IsUnknown<unknown>, true>;
type T061 = Assert<IsUnknown<any>, false>;
type T062 = Assert<IsUnknown<never>, false>;
type T063 = Assert<IsNever<IsUnknown<never>>, false>;
type T064 = Assert<IsUnknown<number>, false>;
type T065 = Assert<IsUnknown<unknown | string>, true>;
