import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {ZoomSlider} from 'ol/control';

/**
 * Helper method for map-creation.
 *
 * @param {string} divId The id of the div for the map.
 * @return {Map} The map instance.
 */
function createMap(divId) {
  var source = new OSM();
  var layer = new TileLayer({
    source: source,
  });
  var map = new Map({
    layers: [layer],
    target: divId,
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
  var zoomslider = new ZoomSlider();
  map.addControl(zoomslider);
  return map;
}

var map1 = createMap('map1');
var map2 = createMap('map2');
var map3 = createMap('map3');
