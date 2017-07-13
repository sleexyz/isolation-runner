const { run } = require('./');

describe("buildTests", () => {
  describe("without nesting", () => {
    it("should spread out the test setup", () => {
      const results = [];
      const bar: Test = function* () {
        results.push('before')
        yield { type: "continuation", cont: function* () { results.push('1'); } };
        yield { type: "continuation", cont: function* () { results.push('2'); } };
        results.push('after');
      }
      run(bar);
      expect(results).toEqual([
        "before",
        "1",
        "after",
        "before",
        "2",
        "after"
      ]);
    });
  });
  describe("with nesting", () => {
    it("can handle nesting", () => {
      const results = [];
      const bar: Test = function* () {
        results.push('before')
        yield { 
          type: "continuation", 
          cont: function* () { 
            results.push('1'); 
            yield { 
              type: "continuation", 
              cont: function* () { results.push('inner'); }
            }
            results.push('2'); 
          } 
        };
        results.push('after');
      }
      run(bar);
      expect(results).toEqual([
        "before",
        "1",
        "inner",
        "2",
        "after"
      ]);
    });
    it("can handle siblings of nested blocks", () => {
      const results = [];
      const bar: Test = function* () {
        results.push('before')
        yield { 
          type: "continuation", 
          cont: function* () { 
            results.push('x1'); 
            yield { 
              type: "continuation", 
              cont: function* () { results.push('xinner'); }
            }
            results.push('x2'); 
          } 
        };
        yield { 
          type: "continuation", 
          cont: function* () { 
            results.push('y1'); 
            yield { 
              type: "continuation", 
              cont: function* () { results.push('yinner'); }
            }
            results.push('y2'); 
          } 
        };
        results.push('after');
      }
      run(bar);
      expect(results).toEqual([
        "before",
        "x1",
        "xinner",
        "x2",
        "after",
        "before",
        "y1",
        "yinner",
        "y2",
        "after"
      ]);
    });
    it("can handle siblings within nested blocks", () => {
      const results = [];
      const bar: Test = function* () {
        results.push('before')
        yield { 
          type: "continuation", 
          cont: function* () { 
            results.push('1'); 
            yield { 
              type: "continuation", 
              cont: function* () { results.push('a'); }
            }
            yield { 
              type: "continuation", 
              cont: function* () { results.push('b'); }
            }
            results.push('2'); 
          } 
        };
        results.push('after');
      }
      run(bar);
      expect(results).toEqual([
        "before",
        "1",
        "a",
        "2",
        "after",
        "before",
        "1",
        "b",
        "2",
        "after"
      ]);
    });
    it("can handle siblings within nested blocks 2", () => {
      const results = [];
      const bar: Test = function* () {
        results.push('before')
        yield { 
          type: "continuation", 
          cont: function* () { 
            results.push('x1'); 
            yield { 
              type: "continuation", 
              cont: function* () { results.push('xa'); }
            }
            yield { 
              type: "continuation", 
              cont: function* () { results.push('xb'); }
            }
            results.push('x2'); 
          } 
        };
        yield { 
          type: "continuation", 
          cont: function* () { 
            results.push('y1'); 
            yield { 
              type: "continuation", 
              cont: function* () { results.push('ya'); }
            }
            yield { 
              type: "continuation", 
              cont: function* () { results.push('yb'); }
            }
            results.push('y2'); 
          } 
        };
        results.push('after');
      }
      run(bar);
      expect(results).toEqual([
        "before",
        "x1",
        "xa",
        "x2",
        "after",
        "before",
        "x1",
        "xb",
        "x2",
        "after",
        "before",
        "y1",
        "ya",
        "y2",
        "after",
        "before",
        "y1",
        "yb",
        "y2",
        "after",
      ]);
    });
  });
});
