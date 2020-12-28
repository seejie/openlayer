import 'ol/ol.css';
import Map from 'ol/Map';
import SourceState from 'ol/source/State';
import Stamen from 'ol/source/Stamen';
import View from 'ol/View';
import {Layer, Tile as TileLayer} from 'ol/layer';
import {fromLonLat, toLonLat} from 'ol/proj';
import {getCenter, getWidth} from 'ol/extent';

var CanvasLayer = /*@__PURE__*/(function (Layer) {
  function CanvasLayer(options) {
    Layer.call(this, options);

    this.features = options.features;

    this.svg = d3
      .select(document.createElement('div'))
      .append('svg')
      .style('position', 'absolute');

    this.svg.append('path').datum(this.features).attr('class', 'boundary');
  }

  if ( Layer ) CanvasLayer.__proto__ = Layer;
  CanvasLayer.prototype = Object.create( Layer && Layer.prototype );
  CanvasLayer.prototype.constructor = CanvasLayer;

  CanvasLayer.prototype.getSourceState = function getSourceState () {
    return SourceState.READY;
  };

  CanvasLayer.prototype.render = function render (frameState) {
    var width = frameState.size[0];
    var height = frameState.size[1];
    var projection = frameState.viewState.projection;
    var d3Projection = d3.geoMercator().scale(1).translate([0, 0]);
    var d3Path = d3.geoPath().projection(d3Projection);

    var pixelBounds = d3Path.bounds(this.features);
    var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
    var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];

    var geoBounds = d3.geoBounds(this.features);
    var geoBoundsLeftBottom = fromLonLat(geoBounds[0], projection);
    var geoBoundsRightTop = fromLonLat(geoBounds[1], projection);
    var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
    if (geoBoundsWidth < 0) {
      geoBoundsWidth += getWidth(projection.getExtent());
    }
    var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];

    var widthResolution = geoBoundsWidth / pixelBoundsWidth;
    var heightResolution = geoBoundsHeight / pixelBoundsHeight;
    var r = Math.max(widthResolution, heightResolution);
    var scale = r / frameState.viewState.resolution;

    var center = toLonLat(getCenter(frameState.extent), projection);
    d3Projection
      .scale(scale)
      .center(center)
      .translate([width / 2, height / 2]);

    d3Path = d3Path.projection(d3Projection);
    d3Path(this.features);

    this.svg.attr('width', width);
    this.svg.attr('height', height);

    this.svg.select('path').attr('d', d3Path);

    return this.svg.node();
  };

  return CanvasLayer;
}(Layer));

var map = new Map({
  layers: [
    new TileLayer({
      source: new Stamen({
        layer: 'watercolor',
      }),
    }) ],
  target: 'map',
  view: new View({
    center: fromLonLat([-97, 38]),
    zoom: 4,
  }),
});

/**
 * Load the topojson data and create an ol/layer/Image for that data.
 */
d3.json('data/topojson/us.json').then(function (us) {
  var layer = new CanvasLayer({
    features: topojson.feature(us, us.objects.counties),
  });

  map.addLayer(layer);
});
