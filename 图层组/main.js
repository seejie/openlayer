import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileJSON from 'ol/source/TileJSON';
import View from 'ol/View';
import {Group as LayerGroup, Tile as TileLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';

// https://openlayers.org/en/latest/examples/layer-group.html
var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new LayerGroup({
      layers: [
        new TileLayer({
          source: new TileJSON({
            url: '20110804-hoa-foodinsecurity-3month.json',
            crossOrigin: 'anonymous',
          }),
        }),
        new TileLayer({
          source: new TileJSON({
            url: '20110804-hoa-foodinsecurity-3month.json',
            crossOrigin: 'anonymous',
          }),
        }) ],
    }) ],
  target: 'map',
  view: new View({
    center: fromLonLat([37.4057, 8.81566]),
    zoom: 4,
  }),
});

function bindInputs(layerid, layer) {
  var visibilityInput = $(layerid + ' input.visible');
  visibilityInput.on('change', function () {
    layer.setVisible(this.checked);
  });
  visibilityInput.prop('checked', layer.getVisible());

  var opacityInput = $(layerid + ' input.opacity');
  opacityInput.on('input', function () {
    layer.setOpacity(parseFloat(this.value));
  });
  opacityInput.val(String(layer.getOpacity()));
}
function setup(id, group) {
  group.getLayers().forEach(function (layer, i) {
    var layerid = id + i;
    bindInputs(layerid, layer);
    if (layer instanceof LayerGroup) {
      setup(layerid, layer);
    }
  });
}
setup('#layer', map.getLayerGroup());

$('#layertree li > span')
  .click(function () {
    $(this).siblings('fieldset').toggle();
  })
  .siblings('fieldset')
  .hide();
