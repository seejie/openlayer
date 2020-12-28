import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {getRenderPixel} from 'ol/render';

var osm = new TileLayer({
  source: new OSM(),
});

var key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var aerial = new TileLayer({
  source: new XYZ({
    attributions: attributions,
    url: 'https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=' + key,
    maxZoom: 20,
  }),
});

var map = new Map({
  layers: [osm, aerial],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

var swipe = document.getElementById('swipe');

aerial.on('prerender', function (event) {
  var ctx = event.context;
  var mapSize = map.getSize();
  var width = mapSize[0] * (swipe.value / 100);
  var tl = getRenderPixel(event, [width, 0]);
  var tr = getRenderPixel(event, [mapSize[0], 0]);
  var bl = getRenderPixel(event, [width, mapSize[1]]);
  var br = getRenderPixel(event, mapSize);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tl[0], tl[1]);
  ctx.lineTo(bl[0], bl[1]);
  ctx.lineTo(br[0], br[1]);
  ctx.lineTo(tr[0], tr[1]);
  ctx.closePath();
  ctx.clip();
});

aerial.on('postrender', function (event) {
  var ctx = event.context;
  ctx.restore();
});

swipe.addEventListener(
  'input',
  function () {
    map.render();
  },
  false
);
