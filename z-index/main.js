import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Fill, RegularShape, Stroke, Style} from 'ol/style';

var stroke = new Stroke({color: 'black', width: 1});

var styles = {
  'square': new Style({
    image: new RegularShape({
      fill: new Fill({color: 'blue'}),
      stroke: stroke,
      points: 4,
      radius: 80,
      angle: Math.PI / 4,
    }),
  }),
  'triangle': new Style({
    image: new RegularShape({
      fill: new Fill({color: 'red'}),
      stroke: stroke,
      points: 3,
      radius: 80,
      rotation: Math.PI / 4,
      angle: 0,
    }),
  }),
  'star': new Style({
    image: new RegularShape({
      fill: new Fill({color: 'green'}),
      stroke: stroke,
      points: 5,
      radius: 80,
      radius2: 4,
      angle: 0,
    }),
  }),
};

function createLayer(coordinates, style, zIndex) {
  var feature = new Feature(new Point(coordinates));
  feature.setStyle(style);

  var source = new VectorSource({
    features: [feature],
  });

  var vectorLayer = new VectorLayer({
    source: source,
  });
  vectorLayer.setZIndex(zIndex);

  return vectorLayer;
}

var layer0 = createLayer([40, 40], styles['star']);
var layer1 = createLayer([0, 0], styles['square'], 1);
var layer2 = createLayer([0, 40], styles['triangle'], 0);

var layers = [];
layers.push(layer1);
layers.push(layer2);

var map = new Map({
  layers: layers,
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 18,
  }),
});

layer0.setMap(map);

function bindInputs(id, layer) {
  var idxInput = document.getElementById('idx' + id);
  idxInput.onchange = function () {
    layer.setZIndex(parseInt(this.value, 10) || 0);
  };
  idxInput.value = String(layer.getZIndex());
}
bindInputs(1, layer1);
bindInputs(2, layer2);
