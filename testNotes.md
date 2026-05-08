#TESTS NOTES

- can use either JS or TS

before each to use fixtures on a test
example of a fixture:

- beforeEach() => {
  store = new func (change func to a function)
  }

example of a test:
describe ("add()", () => {
it("returns an added array with given thing, () => {
assert.deepEqual(store.add(5), [])
});
});

- describe: high-level feature
- it: tests that relate to the higher-level feature

- import {describe, it (and something else armaan moved too fast)} from supertest

## note: there may be a few syntax errors

### note: download supertest for JS/TS

#### note: some other syntax is .post("/add"), .type("form"), (and something else but armaan moved too fast) also do npm tests to run tests
