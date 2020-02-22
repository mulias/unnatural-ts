# unnatural

Unnatural started as an exercise in implemented the natural numbers in
TypeScript's type system. It ended as a bit of a mess which isn't really worth
my time to re-visit any more.

### Why did I do this? That isn't a rhetorical question, I would like to know please.

* I first implemented a naive version of the naturals, `unnatural/small`,
which reaches TS's maximum recursive depth and returns an error for number
greater than `40`.

* To address these size limitations I added `unnatural/big`, a more advanced
implementation which uses a novel trampolining technique to regularly reset the
compiler's recursive depth counter. Using this method we can support numbers up to
`256` by default, and provide a param for increasing the cap to `512` or larger.

* While developing the infrastructure for larger numbers I started accumulating
helper types, which slowly grew into a more formal feature set. At this point in
the project I had ambitions to release a full-featured type-level programming
library to help in typing utilities such as [`ramda`](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ramda),
but thankfully Pierre-Antoine Mills saved me from this fool's errand by
releasing the stellar [ts-toolbelt](https://github.com/pirix-gh/ts-toolbelt)
just for this kind of purpose.

### Where are we now?

I'm pushing the last changes to this repo that I have on my local machine. I
have no idea what I was last doing, but the code compiles,
so it probably does the right thing (tm). The code for `unnatural/big` is
probably the most interesting part of the library, but if you're new to
type-level programming in TS you might find that some of the utility types
challenge your understanding of how TS works.

### Resources, have some fun ok.

[If you also want to start down this dark path then first read this
article](https://medium.com/free-code-camp/typescript-curry-ramda-types-f747e99744ab).
It's a lot, I had to take some time and do lots of experimenting to understand
what was happening. Once you've got a hunch then try implementing some stuff,
like the natural numbers, or a typed version of ramda's [`path`](https://ramdajs.com/docs/#path)
function that doesn't suck ([it's not easy](https://github.com/Microsoft/TypeScript/issues/12290)).
Now that you've spent entirely too much time learning the problem space, you can
start asking yourself the real hard-hitting questions: Do recursive types have a
place in typescript? What's the balance between accurately typing a function,
and providing coherent type errors? Is there a god?
