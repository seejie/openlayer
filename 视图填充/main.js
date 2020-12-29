import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';

/** @type {VectorSource<import("../src/ol/geom/SimpleGeometry.js").default>} */
var source = new VectorSource({
  url: 'https://openlayers.org/en/latest/examples/data/geojson/switzerland.geojson',
  format: new GeoJSON(),
});
var style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1,
  }),
  image: new CircleStyle({
    radius: 5,
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new Stroke({
      color: '#319FD3',
      width: 1,
    }),
  }),
});
var vectorLayer = new VectorLayer({
  source: source,
  style: style,
});
var view = new View({
  center: fromLonLat([6.6339863, 46.5193823]),
  padding: [170, 50, 30, 150],
  zoom: 6,
});
var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer ],
  target: 'map',
  view: view,
});

var zoomtoswitzerland = document.getElementById('zoomtoswitzerland');
zoomtoswitzerland.addEventListener(
  'click',
  function () {
    var feature = source.getFeatures()[0];
    var polygon = feature.getGeometry();
    view.fit(polygon);
  },
  false
);

var centerlausanne = document.getElementById('centerlausanne');
centerlausanne.addEventListener(
  'click',
  function () {
    var feature = source.getFeatures()[1];
    var point = feature.getGeometry();
    view.setCenter(point.getCoordinates());
  },
  false
);
