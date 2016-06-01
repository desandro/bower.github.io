/* jshint browser: true, undef: true, unused: true */

document.addEventListener( 'DOMContentLoaded', domReady, false );

function domReady() {
  addAnchors();
  addGlobalToc();
  renderStats();
}

// create anchor links for headers
function addAnchors() {
  var headers = document.querySelectorAll('.main h2, .main h3, .main h4');

  for ( var i=0, len = headers.length; i < len; i++ ) {
    var header = headers[i];
    var anchor = document.createElement('a');
    anchor.href = '#' + header.id;
    anchor.textContent = '§';
    anchor.className = 'header-anchor';
    header.insertBefore( anchor, header.firstChild );
  }
}

// insert TOC to sidebar
function addGlobalToc() {
  var docsNav = document.querySelector('.docs-nav');
  if ( !docsNav ) {
    return;
  }
  var headers = document.querySelectorAll('.main h2');
  var currentNav = docsNav.querySelector('a[href="' + window.location.pathname + '"]')

  if (currentNav) {
    var ul = document.createElement('ul');
    for ( var i=0, len = headers.length; i < len; i++ ) {
      var header = headers[i];
      var li = document.createElement('li');
      var anchor = document.createElement('a');
      anchor.href = '#' + header.id;
      anchor.textContent = header.lastChild.textContent;
      li.insertBefore( anchor, null );
      ul.insertBefore( li, null );
    }
    currentNav.parentNode.insertBefore( ul, null );
  }
}

// extend/collapse .sidebar on small screens
var sidebar = document.getElementsByClassName('sidebar')[0];
document.getElementsByClassName('menu-btn')[0].addEventListener('click', function () {
  if (sidebar.classList.contains('extended')) {
   sidebar.classList.remove('extended');
  } else {
    sidebar.classList.add('extended');
  }
});

var fetchData = function () {
  var today = new Date();
  var yesterday = new Date(today.getFullYear(),today.getMonth(),today.getDate()-1);
  var yearago = new Date(today.getFullYear()-2,today.getMonth(),today.getDate());
  yesterday = yesterday.toISOString().slice(0, 10);
  yearago = yearago.toISOString().slice(0, 10);
  return fetch('https://api.npmjs.org/downloads/range/'+yearago+':'+yesterday+'/bower').then(function (response) {
    return response.json();
  });
}

var plot = function(npmData) {
  var center, chart, colorScale, domainer, format, gridlines, installsLabel, legend, line_installs, npmData, stack, xAxis, xScale, yAxisInstalls, yAxisInstallsLeft, yScaleInstalls;
  stack = d3.layout.stack().values(function(d) {
    return d;
  }).x(function(d) {
    return d.date;
  }).y(function(d) {
    return d.movingAvg;
  }).order("reverse");
  xScale = new Plottable.Scale.Time();
  yScaleInstalls = new Plottable.Scale.Linear();
  xScale.domainer(new Plottable.Domainer().pad(0));
  domainer = new Plottable.Domainer().addIncludedValue(0).pad(0.2).addPaddingException(0);
  yScaleInstalls.domainer(domainer).ticks(5);
  colorScale = (new Plottable.Scale.Color()).domain(["daily bower installs"]).range(["#EF5734"]);
  gridlines = new Plottable.Component.Gridlines(xScale, yScaleInstalls);
  xAxis = new Plottable.Axis.Time(xScale, "bottom");
  format = function(n) {
    return Math.round(n / 1000).toString() + "k";
  };
  yAxisInstalls = new Plottable.Axis.Numeric(yScaleInstalls, "right", format);
  yAxisInstallsLeft = new Plottable.Axis.Numeric(yScaleInstalls, "left", format);
  legend = new Plottable.Component.Legend(colorScale).xAlign("left");
  installsLabel = new Plottable.Component.AxisLabel("Daily npm Installs", "left");
  line_installs = (new Plottable.Plot.Line(npmData, xScale, yScaleInstalls)).project("x", "day", xScale).project("y", "downloads", yScaleInstalls).classed("npm-installs", true);
  center = line_installs.merge(gridlines).merge(legend);
  chart = new Plottable.Component.Table([[yAxisInstallsLeft, center, yAxisInstalls], [null, xAxis, null]]).renderTo("#users-chart");
};

function renderStats() {
  if(document.getElementById('users-chart')) {
    fetchData().then(function (data) {
      var stats = [];

      for (var i = 3, l = data.downloads.length - 3; i < l; i++) {
        var sum = 0;
        for (var j = -3; j < 4; j++) {
          sum = sum + data.downloads[i+j].downloads;
        }
        var average = sum / 7;

        stats.push({ day: new Date(data.downloads[i].day), downloads: average });
      }

      plot(stats);
    });
  }
}
