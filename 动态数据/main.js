import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {MultiPoint, Point} from 'ol/geom';
import {getVectorContext} from 'ol/render';

var tileLayer = new TileLayer({
  source: new OSM(),
});

var map = new Map({
  layers: [tileLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

var imageStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({color: 'yellow'}),
    stroke: new Stroke({color: 'red', width: 1}),
  }),
});

var headInnerImageStyle = new Style({
  image: new CircleStyle({
    radius: 2,
    fill: new Fill({color: 'blue'}),
  }),
});

var headOuterImageStyle = new Style({
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({color: 'black'}),
  }),
});

var n = 200;
var omegaTheta = 30000; // Rotation period in ms
var R = 7e6;
var r = 2e6;
var p = 2e6;
tileLayer.on('postrender', function (event) {
  var vectorContext = getVectorContext(event);
  var frameState = event.frameState;
  var theta = (2 * Math.PI * frameState.time) / omegaTheta;
  var coordinates = [];
  var i;
  for (i = 0; i < n; ++i) {
    var t = theta + (2 * Math.PI * i) / n;
    var x = (R + r) * Math.cos(t) + p * Math.cos(((R + r) * t) / r);
    var y = (R + r) * Math.sin(t) + p * Math.sin(((R + r) * t) / r);
    coordinates.push([x, y]);
  }
  vectorContext.setStyle(imageStyle);
  vectorContext.drawGeometry(new MultiPoint(coordinates));

  var headPoint = new Point(coordinates[coordinates.length - 1]);

  vectorContext.setStyle(headOuterImageStyle);
  vectorContext.drawGeometry(headPoint);

  vectorContext.setStyle(headInnerImageStyle);
  vectorContext.drawGeometry(headPoint);

  map.render();
});
map.render();
