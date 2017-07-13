# isolation-runner
Proof-of-concept JS test runner.

## Features

- **Automatic test isolation** - If all state is initialized and mutated within the test runner, all tests run as if their sibling tests are all commented out.
- **Type inferred** - By declaring the variables in your test setup in the same place you assign them, flow can determine the types of your context variables.
- **minimal syntax** - Never write `beforeEach` or `afterEach` again! Code before is simply run before **each** test. Code after is run after **each** test.

## Examples:

The following file passes *both* tests. Most test runners would fail on the second test.

```js
import { test } from 'isolation-runner';

test("Foo", function* () {

  let x = 0;

  yield test("inner 1", () => {
    expect(x).toBe(0);
    x == x + 1;
  });

  yield test("inner 2", () => {
    expect(x).toBe(0);
  });

});
```
