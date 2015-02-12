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
  function err(ex) {return sqr(h(t1, t2, ex[0]) - ex[1]);}
  return sum(exs.map(err)) / (2 * exs.length);
}

function fmt(arr) {
  return '[' + arr.join(', ') + ']';
}

function gd(options) { 
  options = options || {};
  var examples = options.examples || [];
  var t1 = options.t1 || 0;
  var t2 = options.t2 || 0;
  var rate = options.rate || 0.01;
  var precision = options.precision || 10;
  var threshold = options.threshold || 20000;
  var callback = options.callback || function() {};

  var _t1, _t2;

  var n = 0;

  function descend() {
    function fd1(ex) {return h(t1, t2, ex[0]) - ex[1];}
    function fd2(ex) {return fd1(ex) * ex[0];}
    var d1 = avg(examples.map(fd1)) * rate;
    var d2 = avg(examples.map(fd2)) * rate; 
    _t1 = toFixed(t1 - d1, precision);
    _t2 = toFixed(t2 - d2, precision);
    n++;  
  }

  function converged() {
    return t1 === _t1 && t2 === _t2;
  }

  for (;;) {
    descend();
    if (converged()) { break; }
    if (n > threshold) {
      console.log('threshold exceeded at ' + n + ' iterations');
      return [_t1, _t2];
    }
    t1 = _t1;
    t2 = _t2;
    if (callback) { callback([t1, t2]) };
  }

  console.log(fmt(examples.map(fmt)));
  console.log('converged at ' + fmt([toFixed(t1, precision/2), toFixed(t2, precision/2)]));
  console.log('after ' + n + ' iterations');
  return [t1, t2];

} 

var exampleSets = [
  [[0, 0], [1, 1], [2, 2], [3, 3]],
  [[0, 1], [1, 2], [2, 3], [3, 4]],
  [[0, 1], [1, 1.5], [2, 2], [3, 2.5]],
  [[0, 0.5], [1, 1], [2, 1.5], [3, 2]],
  [[0, 3], [1, 4.6], [2, 6.6], [3, 8.9]],
  [[0, 2], [2, 5], [3, 2], [4, 5], [5, 3]]
];

var set = []; exampleSets.push(set);
for (var i=0; i<21; i++) {
  var sign = (i % 2 === 0) ? 1 : -1;
  set.push([i, (1.1 * i * sign)]);
}

function renderExamples(exampleSets) {
  exampleSets.forEach(function(examples, i) {
    var str = fmt(examples.map(fmt));
    $('#examples').append($('<li data-index="' + i + '">' + str + "</li>")); 
  });

  $('#examples li').on('click', function() {
    $('#examples li').removeClass('selected');
    $(this).addClass('selected');
    renderGradientDescent($(this).data('index'));
  });

  $('#examples li').first().trigger('click');
}

function renderGradientDescent(index) {
  var data = exampleSets[index];
  var xmin = Infinity;
  var xmax = -Infinity;

  var params = gd({examples: data});

  data.forEach(function(ex) {
    xmin = Math.min(ex[0], xmin);
    xmax = Math.max(ex[0], xmax);
  });

    function drawChart(params) {
      function h(x) {
        var a = params[1];
        var b = params[0];
        return (a * x) + b;
      }

      $.plot('#chart', [{ 
        data: data,
        points: {show: true}
      }, {
        data: [[xmin, h(xmin)], [xmax, h(xmax)]],
        lines: {show: true}
      }]);
    }

  console.log([[xmin, h(xmin)], [xmax, h(xmax)]]);

  drawChart(params);

}

if (typeof window != "undefined") {
  window.onload = function() {
    $('#chart').css({width: 640, height: 480});
    renderExamples(exampleSets);
  };
}