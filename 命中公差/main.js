import 'ol/ol.css';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Map from 'ol/Map';
import View from 'ol/View';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var raster = new TileLayer({
  source: new OSM(),
});

var style = new Style({
  stroke: new Stroke({
    color: 'black',
    width: 1,
  }),
});

var feature = new Feature(
  new LineString([
    [-4000000, 0],
    [4000000, 0] ])
);

var vector = new VectorLayer({
  source: new VectorSource({
    features: [feature],
  }),
  style: style,
});

var map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

var hitTolerance;

var statusElement = document.getElementById('status');

map.on('singleclick', function (e) {
  var hit = false;
  map.forEachFeatureAtPixel(
    e.pixel,
    function () {
      hit = true;
    },
    {
      hitTolerance: hitTolerance,
    }
  );
  if (hit) {
    style.getStroke().setColor('green');
    statusElement.innerHTML = 'A feature got hit!';
  } else {
    style.getStroke().setColor('black');
    statusElement.innerHTML = 'No feature got hit.';
  }
  feature.changed();
});

var selectHitToleranceElement = document.getElementById('hitTolerance');
var circleCanvas = document.getElementById('circle');

var changeHitTolerance = function () {
  hitTolerance = parseInt(selectHitToleranceElement.value, 10);

  var size = 2 * hitTolerance + 2;
  circleCanvas.width = size;
  circleCanvas.height = size;
  var ctx = circleCanvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(
    hitTolerance + 1,
    hitTolerance + 1,
    hitTolerance + 0.5,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.stroke();
};

selectHitToleranceElement.onchange = changeHitTolerance;
changeHitTolerance();
