import 'ol/ol.css';
import Fill from 'ol/style/Fill';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var raster = new TileLayer({
  source: new OSM(),
});

var highlightStyle = new Style({
  fill: new Fill({
    color: 'rgba(255,255,255,0.7)',
  }),
  stroke: new Stroke({
    color: '#3399CC',
    width: 3,
  }),
});

var vector = new VectorLayer({
  source: new VectorSource({
    url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
    format: new GeoJSON(),
  }),
});

var map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
    multiWorld: true,
  }),
});

var selected = [];

var status = document.getElementById('status');

map.on('singleclick', function (e) {
  map.forEachFeatureAtPixel(e.pixel, function (f) {
    var selIndex = selected.indexOf(f);
    if (selIndex < 0) {
      selected.push(f);
      f.setStyle(highlightStyle);
    } else {
      selected.splice(selIndex, 1);
      f.setStyle(undefined);
    }
  });

  status.innerHTML = '&nbsp;' + selected.length + ' selected features';
});
