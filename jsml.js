var canvas;

if (typeof window != "undefined") {
  window.onload = function() {
    canvas = document.getElementById('canvas');
  }
}

function sqr(x) {
  return x * x;
}

function sum(xs) {
  var n = 0;
  for (var i=0, ii=xs.length; i<ii; i++) {
    n += xs[i];
  }
  return n;
}

function avg(xs) {
  return sum(xs) / xs.length;
}

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return Math.round(value * power) / power;
}

function h(t1, t2, x) {
  return t1 + (t2 * x);
}

function j(t1, t2, exs) {
  function err(ex) {return sqr(h(t1, t2, ex[0]) - ex[1])}
  return sum(exs.map(err)) / (2 * exs.length);
}

function fmt(arr) {
  return '[' + arr.join(', ') + ']';
}

function gd(examples, t1, t2, rate, precision) {
  t1 = t1 || 0;
  t2 = t2 || 0;
  rate = rate || 0.2;
  precision = precision || 10;

  function fd1(ex) {return h(t1, t2, ex[0]) - ex[1]}
  function fd2(ex) {return fd1(ex) * ex[0]}
  var d1 = avg(examples.map(fd1)) * rate;
  var d2 = avg(examples.map(fd2)) * rate; 
  var _t1 = toFixed(t1 - d1, precision);
  var _t2 = toFixed(t2 - d2, precision);

  //console.log({t1: t1, _t1: _t1, t2: t2, _t2: _t2, d1: d1, d2: d2});

  if (t1 === _t1 && t2 === _t2) {
    console.log(fmt(examples.map(fmt)));
    console.log(
      'converged at ' + 
      fmt([toFixed(t1, precision/2), toFixed(t2, precision/2)])
    );
    return [t1, t2];
  } else {
    return gd(examples, _t1, _t2, rate, precision);
  }
} 

var exs = [
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  [[0, 1], [1, 2], [2, 3], [3, 4]],
  [[0, 1], [1, 1.5], [2, 2], [3, 2.5]],
  [[0, 0.5], [1, 1], [2, 1.5], [3, 2]],
  [[0, 3], [1, 4.6], [2, 6.6], [3, 8.9]]
];

exs.map(gd);