import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import {getRenderPixel} from 'ol/render';

var key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var roads = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + key,
    tileSize: 512,
    maxZoom: 22,
  }),
});

var imagery = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
  }),
});

var container = document.getElementById('map');

var map = new Map({
  layers: [roads, imagery],
  target: container,
  view: new View({
    center: fromLonLat([-109, 46.5]),
    zoom: 6,
  }),
});

var radius = 75;
document.addEventListener('keydown', function (evt) {
  if (evt.which === 38) {
    radius = Math.min(radius + 5, 150);
    map.render();
    evt.preventDefault();
  } else if (evt.which === 40) {
    radius = Math.max(radius - 5, 25);
    map.render();
    evt.preventDefault();
  }
});

// get the pixel position with every move
var mousePosition = null;

container.addEventListener('mousemove', function (event) {
  mousePosition = map.getEventPixel(event);
  map.render();
});

container.addEventListener('mouseout', function () {
  mousePosition = null;
  map.render();
});

// before rendering the layer, do some clipping
imagery.on('prerender', function (event) {
  var ctx = event.context;
  ctx.save();
  ctx.beginPath();
  if (mousePosition) {
    // only show a circle around the mouse
    var pixel = getRenderPixel(event, mousePosition);
    var offset = getRenderPixel(event, [
      mousePosition[0] + radius,
      mousePosition[1] ]);
    var canvasRadius = Math.sqrt(
      Math.pow(offset[0] - pixel[0], 2) + Math.pow(offset[1] - pixel[1], 2)
    );
    ctx.arc(pixel[0], pixel[1], canvasRadius, 0, 2 * Math.PI);
    ctx.lineWidth = (5 * canvasRadius) / radius;
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.stroke();
  }
  ctx.clip();
});

// after rendering the layer, restore the canvas context
imagery.on('postrender', function (event) {
  var ctx = event.context;
  ctx.restore();
});
