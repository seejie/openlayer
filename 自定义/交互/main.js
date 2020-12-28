import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import {Fill, Icon, Stroke, Style} from 'ol/style';
import {LineString, Point, Polygon} from 'ol/geom';
import {
  Pointer as PointerInteraction,
  defaults as defaultInteractions,
} from 'ol/interaction';
import {TileJSON, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var Drag = /*@__PURE__*/(function (PointerInteraction) {
  function Drag() {
    PointerInteraction.call(this, {
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleMoveEvent: handleMoveEvent,
      handleUpEvent: handleUpEvent,
    });

    /**
     * @type {import("../src/ol/coordinate.js").Coordinate}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'pointer';

    /**
     * @type {Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;
  }

  if ( PointerInteraction ) Drag.__proto__ = PointerInteraction;
  Drag.prototype = Object.create( PointerInteraction && PointerInteraction.prototype );
  Drag.prototype.constructor = Drag;

  return Drag;
}(PointerInteraction));

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
function handleDownEvent(evt) {
  var map = evt.map;

  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });

  if (feature) {
    this.coordinate_ = evt.coordinate;
    this.feature_ = feature;
  }

  return !!feature;
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Map browser event.
 */
function handleDragEvent(evt) {
  var deltaX = evt.coordinate[0] - this.coordinate_[0];
  var deltaY = evt.coordinate[1] - this.coordinate_[1];

  var geometry = this.feature_.getGeometry();
  geometry.translate(deltaX, deltaY);

  this.coordinate_[0] = evt.coordinate[0];
  this.coordinate_[1] = evt.coordinate[1];
}

/**
 * @param {import("../src/ol/MapBrowserEvent.js").default} evt Event.
 */
function handleMoveEvent(evt) {
  if (this.cursor_) {
    var map = evt.map;
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      return feature;
    });
    var element = evt.map.getTargetElement();
    if (feature) {
      if (element.style.cursor != this.cursor_) {
        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
      element.style.cursor = this.previousCursor_;
      this.previousCursor_ = undefined;
    }
  }
}

/**
 * @return {boolean} `false` to stop the drag sequence.
 */
function handleUpEvent() {
  this.coordinate_ = null;
  this.feature_ = null;
  return false;
}

var pointFeature = new Feature(new Point([0, 0]));

var lineFeature = new Feature(
  new LineString([
    [-1e7, 1e6],
    [-1e6, 3e6] ])
);

var polygonFeature = new Feature(
  new Polygon([
    [
      [-3e6, -1e6],
      [-3e6, 1e6],
      [-1e6, 1e6],
      [-1e6, -1e6],
      [-3e6, -1e6] ] ])
);

var map = new Map({
  interactions: defaultInteractions().extend([new Drag()]),
  layers: [
    new TileLayer({
      source: new TileJSON({
        url: '/aj.1x1-degrees.json'
      }),
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [pointFeature, lineFeature, polygonFeature],
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.95,
          src: 'data/icon.png',
        }),
        stroke: new Stroke({
          width: 3,
          color: [255, 0, 0, 1],
        }),
        fill: new Fill({
          color: [0, 0, 255, 0.6],
        }),
      }),
    }) ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
