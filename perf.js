var lazy = require('./index');

var colors = ['blue', 'orange', 'yellow', 'red', 'green', 'purple', 'white'];
var types = ['a', 'b', 'c', 'd', 'e'];

function getRandom (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildArray (len) {
  var results = new Array(len);
  for (var i = 0; i < len; i++) {
    results[i] = {
      color: getRandom(colors),
      type: getRandom(types)
    }
  }
  return results;
}


function apply (array) {
  return array
  .filter(function (element) {
    return element.type === 'a';
  })
  .map(function (element) {
    return element.color;
  })
  .filter(function (element) {
    return element[0] === 'b';
  });
}


var array = buildArray(1e6);

console.time('lazy');
var b = apply(lazy(array));
console.log(b.value().length);
console.timeEnd('lazy');



console.time('standard');
var a = apply(array)
console.log(a.length);
console.timeEnd('standard');
