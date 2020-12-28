import 'ol/ol.css';
import Map from 'ol/Map';
import TopoJSON from 'ol/format/TopoJSON';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';
import {fromLonLat} from 'ol/proj';

var key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';

var roadStyleCache = {};
var roadColor = {
  'major_road': '#776',
  'minor_road': '#ccb',
  'highway': '#f39',
};
var buildingStyle = new Style({
  fill: new Fill({
    color: '#666',
    opacity: 0.4,
  }),
  stroke: new Stroke({
    color: '#444',
    width: 1,
  }),
});
var waterStyle = new Style({
  fill: new Fill({
    color: '#9db9e8',
  }),
});
var roadStyle = function (feature) {
  var kind = feature.get('kind');
  var railway = feature.get('railway');
  var sort_key = feature.get('sort_key');
  var styleKey = kind + '/' + railway + '/' + sort_key;
  var style = roadStyleCache[styleKey];
  if (!style) {
    var color, width;
    if (railway) {
      color = '#7de';
      width = 1;
    } else {
      color = roadColor[kind];
      width = kind == 'highway' ? 1.5 : 1;
    }
    style = new Style({
      stroke: new Stroke({
        color: color,
        width: width,
      }),
      zIndex: sort_key,
    });
    roadStyleCache[styleKey] = style;
  }
  return style;
};

var map = new Map({
  layers: [
    new VectorTileLayer({
      source: new VectorTileSource({
        attributions:
          '&copy; OpenStreetMap contributors, Who’s On First, ' +
          'Natural Earth, and openstreetmapdata.com',
        format: new TopoJSON({
          layerName: 'layer',
          layers: ['water', 'roads', 'buildings'],
        }),
        maxZoom: 19,
        url:
          'https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=' +
          key,
      }),
      style: function (feature, resolution) {
        switch (feature.get('layer')) {
          case 'water':
            return waterStyle;
          case 'roads':
            return roadStyle(feature);
          case 'buildings':
            return resolution < 10 ? buildingStyle : null;
          default:
            return null;
        }
      },
    }) ],
  target: 'map',
  view: new View({
    center: fromLonLat([-74.0064, 40.7142]),
    maxZoom: 19,
    zoom: 15,
  }),
});
