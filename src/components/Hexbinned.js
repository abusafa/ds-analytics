/*global L, turf*/

import React, {PropTypes} from 'react';
//import turf from '@turf/turf';
import pts from '../data/pharmacy.geo.json';
 window.turf = turf
const bbox = [39.040604,21.407687,39.300156,21.788194];
var grid = turf.hex(bbox, 0.005);
var grid = turf.count(grid, pts, 'pt_count');



console.log(grid);
//var grid = turf.count(grid, pts, 'pt_count');

export default class Hexbinned extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
      L.mapbox.accessToken = 'pk.eyJ1IjoiaWhhYiIsImEiOiJZT19QbkJJIn0.ROWLhlTd-2mI94QvdzrH8g';

      const layers = {
          Dark: L.mapbox.tileLayer('mapbox.dark'),
          Streets: L.mapbox.tileLayer('mapbox.streets'),
          Outdoors: L.mapbox.tileLayer('mapbox.outdoors'),
          Satellite: L.mapbox.tileLayer('mapbox.satellite')
      };

      this.mapview = L.mapbox.map('map-canvas', null).setView([
          21.527138, 39.190617
      ], 12);
      window.mapview = this.mapview;

      var layerGroup = L.layerGroup().addTo(this.mapview);


      layers.Dark.addTo(this.mapview);
      L.control.layers(layers).addTo(this.mapview);
      this.pharmacyLayer = L.mapbox.featureLayer().addTo(this.mapview);
      //this.pharmacyLayer.setGeoJSON(grid);



      grid.features.forEach(function(cell) {

          var pt_count = cell.properties.pt_count;

          var _nohex = cell._nohex = {};
          _nohex.weight = 0;
          _nohex.color = '#00ffff';
          _nohex.fillOpacity = 0;

          var _nocount = cell._nocount = {};
          _nocount.weight = 0.5;
          _nocount.color = '#E9D362';
          _nocount.fillOpacity = 0;

          var _withCount = cell._withCount = {};
          _withCount.color = '#E9D362';
          _withCount.weight = 0;
          _withCount.fill = '#E9D362';
          _withCount.fillOpacity = 0;
          if(pt_count >= 2) {
            _withCount.fillOpacity = 0.2;
          } if(pt_count >= 5) {
            _withCount.fillOpacity = 0.3;
            _withCount.weight = 1;
          } if(pt_count >= 8) {
            _withCount.weight = 1;
            _withCount.fillOpacity = 0.45;
          } if(pt_count >= 10) {
            _withCount.weight = 2;
            _withCount.fillOpacity = 0.65;
          }

          cell.properties = cell._withCount;
        });

        var hex = L.geoJson(grid)
            .eachLayer(function(l) {
                l.setStyle(l.feature.properties);
            })
            .addTo(layerGroup);

        L.geoJson(pts, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
              radius: 0.5,
              fillColor:'#ffffff',
              fillOpacity:1,
              stroke: false
            });
          }
        }).addTo(layerGroup);


  }

  render() {
    return (
      <div>
        <div id="map-canvas" className="map-canvas"></div>
      </div>
    );
  }
}

Hexbinned.propTypes = {
};
