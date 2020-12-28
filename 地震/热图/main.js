import 'ol/ol.css';
import KML from 'ol/format/KML';
import Map from 'ol/Map';
import Stamen from 'ol/source/Stamen';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Heatmap as HeatmapLayer, Tile as TileLayer} from 'ol/layer';

var blur = document.getElementById('blur');
var radius = document.getElementById('radius');

var vector = new HeatmapLayer({
  source: new VectorSource({
    // url: 'data/2012_Earthquakes_Mag5.kml',
    url: 'https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml',
    format: new KML({
      extractStyles: false,
    }),
  }),
  blur: parseInt(blur.value, 10),
  radius: parseInt(radius.value, 10),
  weight: function (feature) {
    // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
    // standards-violating <magnitude> tag in each Placemark.  We extract it from
    // the Placemark's name instead.
    var name = feature.get('name');
    var magnitude = parseFloat(name.substr(2));
    return magnitude - 5;
  },
});

var raster = new TileLayer({
  source: new Stamen({
    layer: 'toner',
  }),
});

new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

var blurHandler = function () {
  vector.setBlur(parseInt(blur.value, 10));
};
blur.addEventListener('input', blurHandler);
blur.addEventListener('change', blurHandler);

var radiusHandler = function () {
  vector.setRadius(parseInt(radius.value, 10));
};
radius.addEventListener('input', radiusHandler);
radius.addEventListener('change', radiusHandler);
