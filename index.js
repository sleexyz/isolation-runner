// @flow
type Continuation = {
  type: "continuation",
  cont: Test
}
type TestItem =  Continuation
type Test = () => Generator<TestItem, void, void>;

const updatePath = (depth, counter, path: Array<number>) => {
  const newPath = [...path];
  newPath[depth] = counter;
  return newPath;
}

const _runTests = function (test: Test, depth: number, path: Array<number>, baseTest: Test, continuations) {
  const isFrontier = path[depth] === undefined;
  if (isFrontier) {
    let counter = 0;

    // Run setup
    const coroutine = test();

    // Run first test in test tree
    while (true) {
      const { value: testItem, done } = coroutine.next();
      if (done) {
        return;
      }
      if (testItem && testItem.type === "continuation") {
        _runTests(testItem.cont, depth + 1, updatePath(depth, counter, path), baseTest, continuations);
        counter += 1;
        break;
      } 
    }

    // Add additional tests to list of continuations
    // Run teardown
    for (const testItem of coroutine) {
      if (testItem.type === "continuation") {
        const newPath = updatePath(depth, counter, path);
        continuations.push(() => {
           _runTests(baseTest, 0, newPath, baseTest, continuations);
        });
        counter += 1;
      } 
    }

  } else {
    // Run setup
    const testToRun = path[depth];
    const coroutine = test();

    // Skip all tests before the specified test
    // Run the specified test
    for (let counter = 0; counter <= testToRun; counter += 1) {
      const { value: testItem, done } = coroutine.next();
      if (done) {
        return;
      }
      if (testItem && testItem.type === "continuation") {
        if (counter === testToRun) {
           _runTests(testItem.cont, depth + 1, updatePath(depth, counter, path), baseTest, continuations);
           break;
        }
      }
    }

    // Skip all remaining tests
    // Run teardown
    for (const testItem of coroutine) {
    }
  }
};

const run = function(test: Test) {
  const continuations = [];
  const tests = _runTests(test, 0, [], test, continuations);
  for (const cont of continuations) {
    cont();
  }
}

module.exports = {
  run
}
