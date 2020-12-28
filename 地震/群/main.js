import 'ol/ol.css';
import KML from 'ol/format/KML';
import Map from 'ol/Map';
import View from 'ol/View';
import {
  Circle as CircleStyle,
  Fill,
  RegularShape,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import {Cluster, Stamen, Vector as VectorSource} from 'ol/source';
import {
  Select,
  defaults as defaultInteractions,
} from 'ol/interaction';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {createEmpty, extend, getHeight, getWidth} from 'ol/extent';

var earthquakeFill = new Fill({
  color: 'rgba(255, 153, 0, 0.8)',
});
var earthquakeStroke = new Stroke({
  color: 'rgba(255, 204, 0, 0.2)',
  width: 1,
});
var textFill = new Fill({
  color: '#fff',
});
var textStroke = new Stroke({
  color: 'rgba(0, 0, 0, 0.6)',
  width: 3,
});
var invisibleFill = new Fill({
  color: 'rgba(255, 255, 255, 0.01)',
});

function createEarthquakeStyle(feature) {
  // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
  // standards-violating <magnitude> tag in each Placemark.  We extract it
  // from the Placemark's name instead.
  var name = feature.get('name');
  var magnitude = parseFloat(name.substr(2));
  var radius = 5 + 20 * (magnitude - 5);

  return new Style({
    geometry: feature.getGeometry(),
    image: new RegularShape({
      radius1: radius,
      radius2: 3,
      points: 5,
      angle: Math.PI,
      fill: earthquakeFill,
      stroke: earthquakeStroke,
    }),
  });
}

var maxFeatureCount;
var vector = null;
var calculateClusterInfo = function (resolution) {
  maxFeatureCount = 0;
  var features = vector.getSource().getFeatures();
  var feature, radius;
  for (var i = features.length - 1; i >= 0; --i) {
    feature = features[i];
    var originalFeatures = feature.get('features');
    var extent = createEmpty();
    var j = (void 0), jj = (void 0);
    for (j = 0, jj = originalFeatures.length; j < jj; ++j) {
      extend(extent, originalFeatures[j].getGeometry().getExtent());
    }
    maxFeatureCount = Math.max(maxFeatureCount, jj);
    radius = (0.25 * (getWidth(extent) + getHeight(extent))) / resolution;
    feature.set('radius', radius);
  }
};

var currentResolution;
function styleFunction(feature, resolution) {
  if (resolution != currentResolution) {
    calculateClusterInfo(resolution);
    currentResolution = resolution;
  }
  var style;
  var size = feature.get('features').length;
  if (size > 1) {
    style = new Style({
      image: new CircleStyle({
        radius: feature.get('radius'),
        fill: new Fill({
          color: [255, 153, 0, Math.min(0.8, 0.4 + size / maxFeatureCount)],
        }),
      }),
      text: new Text({
        text: size.toString(),
        fill: textFill,
        stroke: textStroke,
      }),
    });
  } else {
    var originalFeature = feature.get('features')[0];
    style = createEarthquakeStyle(originalFeature);
  }
  return style;
}

function selectStyleFunction(feature) {
  var styles = [
    new Style({
      image: new CircleStyle({
        radius: feature.get('radius'),
        fill: invisibleFill,
      }),
    }) ];
  var originalFeatures = feature.get('features');
  var originalFeature;
  for (var i = originalFeatures.length - 1; i >= 0; --i) {
    originalFeature = originalFeatures[i];
    styles.push(createEarthquakeStyle(originalFeature));
  }
  return styles;
}

vector = new VectorLayer({
  source: new Cluster({
    distance: 40,
    source: new VectorSource({
      // url: 'data/2012_Earthquakes_Mag5.kml',
      url: 'https://openlayers.org/en/latest/examples/data/kml/2012_Earthquakes_Mag5.kml',
      format: new KML({
        extractStyles: false,
      }),
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
  interactions: defaultInteractions().extend([
    new Select({
      condition: function (evt) {
        return evt.type == 'pointermove' || evt.type == 'singleclick';
      },
      style: selectStyleFunction,
    }) ]),
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
