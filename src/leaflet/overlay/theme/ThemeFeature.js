/**
 *Class: ThemeFeature
 *客户端专题图要素类
 * 支持的geometry参数类型为L.Point,L.LatLng,L.Polyline,L.Polygon
 */
require('../../core/Base');
var SuperMap = require('../../../common/SuperMap');
var L = require("leaflet");

var ThemeFeature = L.Class.extend({
    initialize: function (geometry, attributes) {
        this.geometry = geometry;
        this.attributes = attributes;
    },

    toFeature: function () {
        var geometry = this.geometry;
        var points = [];
        if (geometry instanceof L.Polyline) {
            points = this.reverseLatLngs(geometry.getLatLngs());
            geometry = new SuperMap.Geometry.LineString(points);
        } else if (geometry instanceof L.Polygon) {
            points = this.reverseLatLngs(geometry.getLatLngs());
            geometry = new SuperMap.Geometry.Polygon(points);
        } else {
            if (geometry instanceof L.LatLng) {
                points = [geometry.lng, geometry.lat];
            } else if (geometry instanceof L.Point) {
                points = [geometry.x, geometry.y];
            }
            if (points.length > 1) {
                geometry = new SuperMap.Geometry.Point(points[0], points[1]);
            }
        }
        return new SuperMap.Feature.Vector(geometry, this.attributes);
    },

    reverseLatLngs: function (latlngs) {
        if (!L.Util.isArray(latlngs)) {
            latlngs = [latlngs];
        }
        for (var i = 0; i < latlngs.length; i++) {
            latlngs[i] = [latlngs[i][1], latlngs[i][0]];
        }
        return latlngs;
    }
});

L.supermap.themeFeature = function (geometry, attributes) {
    return new ThemeFeature(geometry, attributes);
};
module.exports = ThemeFeature;