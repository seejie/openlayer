import 'ol/ol.css';
import KML from 'ol/format/KML';
import Map from 'ol/Map';
import Polygon from 'ol/geom/Polygon';
import Stamen from 'ol/source/Stamen';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Fill, Icon, Stroke, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {toContext} from 'ol/render';

var symbol = [
  [0, 0],
  [4, 2],
  [6, 0],
  [10, 5],
  [6, 3],
  [4, 5],
  [0, 0] ];
var scale;
var scaleFunction = function (coordinate) {
  return [coordinate[0] * scale, coordinate[1] * scale];
};

var styleCache = {};
var styleFunction = function (feature) {
  // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
  // standards-violating <magnitude> tag in each Placemark.  We extract it from
  // the Placemark's name instead.
  var name = feature.get('name');
  var magnitude = parseFloat(name.substr(2));
  var size = parseInt(10 + 40 * (magnitude - 5), 10);
  scale = size / 10;
  var style = styleCache[size];
  if (!style) {
    var canvas = document.createElement('canvas');
    var vectorContext = toContext(canvas.getContext('2d'), {
      size: [size, size],
      pixelRatio: 1,
    });
    vectorContext.setStyle(
      new Style({
        fill: new Fill({color: 'rgba(255, 153, 0, 0.4)'}),
        stroke: new Stroke({color: 'rgba(255, 204, 0, 0.2)', width: 2}),
      })
    );
    vectorContext.drawGeometry(new Polygon([symbol.map(scaleFunction)]));
    style = new Style({
      image: new Icon({
        img: canvas,
        imgSize: [size, size],
        rotation: 1.2,
      }),
    });
    styleCache[size] = style;
  }
  return style;
};

var vector = new VectorLayer({
  source: new VectorSource({
    // url: 'data/2012_Earthquakes_Mag5.kml',
    url: 'https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml',
    format: new KML({
      extractStyles: false,
    }),
  }),
  style: styleFunction,
});

var raster = new TileLayer({
  source: new Stamen({
    layer: 'toner',
  }),
});

var map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
