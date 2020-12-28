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

var imagery = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
    crossOrigin: '',
  }),
});

var container = document.getElementById('map');

var map = new Map({
  layers: [imagery],
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

// after rendering the layer, show an oversampled version around the pointer
imagery.on('postrender', function (event) {
  if (mousePosition) {
    var pixel = getRenderPixel(event, mousePosition);
    var offset = getRenderPixel(event, [
      mousePosition[0] + radius,
      mousePosition[1] ]);
    var half = Math.sqrt(
      Math.pow(offset[0] - pixel[0], 2) + Math.pow(offset[1] - pixel[1], 2)
    );
    var context = event.context;
    var centerX = pixel[0];
    var centerY = pixel[1];
    var originX = centerX - half;
    var originY = centerY - half;
    var size = Math.round(2 * half + 1);
    var sourceData = context.getImageData(originX, originY, size, size).data;
    var dest = context.createImageData(size, size);
    var destData = dest.data;
    for (var j = 0; j < size; ++j) {
      for (var i = 0; i < size; ++i) {
        var dI = i - half;
        var dJ = j - half;
        var dist = Math.sqrt(dI * dI + dJ * dJ);
        var sourceI = i;
        var sourceJ = j;
        if (dist < half) {
          sourceI = Math.round(half + dI / 2);
          sourceJ = Math.round(half + dJ / 2);
        }
        var destOffset = (j * size + i) * 4;
        var sourceOffset = (sourceJ * size + sourceI) * 4;
        destData[destOffset] = sourceData[sourceOffset];
        destData[destOffset + 1] = sourceData[sourceOffset + 1];
        destData[destOffset + 2] = sourceData[sourceOffset + 2];
        destData[destOffset + 3] = sourceData[sourceOffset + 3];
      }
    }
    context.beginPath();
    context.arc(centerX, centerY, half, 0, 2 * Math.PI);
    context.lineWidth = (3 * half) / radius;
    context.strokeStyle = 'rgba(255,255,255,0.5)';
    context.putImageData(dest, originX, originY);
    context.stroke();
    context.restore();
  }
});
