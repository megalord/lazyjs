Object.assign || (Object.assign = function (target, source) {
  Object.keys(source).forEach(function (key) {
    target[key] = source[key];
  });
  return target;
})

function lazy (input, builder) {
  var EXCLUDE = '$EXCLUDE$';

  var interface = {};
  var isInputArray = Array.isArray(input);
  var operations = [];


  //-----------//
  // arguments //
  //-----------//

  function throwTypeError (message, value) {
      throw new Error(message + ', but got a ' + typeof value);
  }

  if (!isInputArray) {
    if (typeof input !== 'number') {
      throwTypeError('Expected lazy() to be called with array or number', input);
    }
    if (typeof builder !== 'function') {
      throwTypeError('Expected `builder` argument to be a function', builder);
    }
    input = { length: input };
  }


  //------------//
  // operations //
  //------------//

  function defineOp (type) {
    interface[type] = function (fn) {
      operations.push({
        type: type,
        fn: fn
      });
      return interface;
    }
  }

  function defineReset (name) {
    interface[name] = function () {
      input = [][name].apply(value(), [].slice.call(arguments));
      operations = [];
      return interface;
    }
  }

  function pluck (key) {
    interface.map(function (object) {
      return object[key];
    });
    return interface;
  }

  function remove (fn) {
    interface.filter(function (element) {
      return !fn(element);
    });
    return interface;
  }

  ['concat', 'reverse', 'sort'].forEach(defineReset);
  ['each', 'filter', 'map'].forEach(defineOp);

  Object.assign(interface, {
    pluck: pluck,
    remove: remove
  });


  //-----------//
  // accessors //
  //-----------//

  function every (fn) {
    interface.filter(fn);
    var i = 0;
    while (i < input.length && reduceOps(i++) !== EXCLUDE) {}
    return i === input.length;
  }

  function first () {
    return nth(0);
  }

  function last () {
    var result;
    var i = 0;
    while (i < input.length && (result = reduceOps(i++)) !== EXCLUDE) {}
    return i === input.length ? undefined : result;
  }

  function nth (n) {
    var result;
    var i = 0;
    var numPastResults = 0;
    while (numPastResults < n + 1 && i < input.length) {
      result = reduceOps(i++);
      if (result !== EXCLUDE) {
        numPastResults++;
      }
    }
    return result === EXCLUDE ? undefined : result;
  }

  function reduceOps (i) {
    var result = isInputArray ? input[i] : builder(i);
    var tmp;
    for (var j = 0; j < operations.length; j++) {
      tmp = operations[j].fn(result);
      if (operations[j].type === 'filter') {
        if (!tmp) {
          return EXCLUDE;
        }
      } else {
        result = tmp;
      }
    }
    return result;
  }

  function slice (start, end) {
    var numDesiredResults = (end || input.length) - start;
    var results = [];
    var result;
    var i = 0;
    while (results.length < numDesiredResults && i < input.length) {
      result = reduceOps(i++);
      if (result !== EXCLUDE) {
        results.push(result);
      }
    }
    return results;
  }

  function some (fn) {
    interface.filter(fn);
    var i = 0;
    while (i < input.length && reduceOps(i++) === EXCLUDE) {}
    return i < input.length;
  }

  function value () {
    var results = [];
    var result;
    for (var i = 0; i < input.length; i++) {
      result = reduceOps(i);
      if (result !== EXCLUDE) {
        results.push(result);
      }
    }
    return results;
  }

  return Object.assign(interface, {
    every: every,
    first: first,
    last: last,
    nth: nth,
    slice: slice,
    some: some,
    value: value
  });
}


function range (a, b) {
  if (b === undefined) {
    b = a;
    a = 0;
  }
  return lazy(b - a, function (i) {
    return i + a;
  });
}

module.exports = Object.assign(lazy, {
  range: range
});
