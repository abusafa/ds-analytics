/*global L, turf*/

import React, {PropTypes} from 'react';
import {each} from 'lodash';

import {Slider, InputNumber, Row, Col, Select, Radio, Table} from 'antd';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import './PharmaciesAccessibleWithin.css';
import turf from '@turf/turf';

import pharmacyGeoJson from '../data/pharmacy.geo.json';
import commercialGeoJson from '../data/commercial.geo.json';
import civilDefeGenseoJson from '../data/civil_defense.geo.json';

const geojsons = {
  "pharmacy":pharmacyGeoJson,
  "commercial":commercialGeoJson,
  "civil defense":civilDefeGenseoJson,

}

const columns = [{
  title: 'Title',
  dataIndex: 'properties.title',
  key: 'properties.title',
}];

import routeGeoJson from '../data/route.geo.json';
each(pharmacyGeoJson.features, (f) => {
    f.properties = {
        "marker-color": "#000",
        "marker-size": "small",
        "marker-symbol": "pharmacy",
        "title": f.properties.ArabicName,
        ...f.properties
    }
});

each(commercialGeoJson.features, (f) => {
    f.properties = {
        "marker-color": "#000",
        "marker-size": "small",
        "marker-symbol": "shop",
        "title": f.properties.ArabicName,
        ...f.properties
    }
});

each(civilDefeGenseoJson.features, (f) => {
    f.properties = {
        "marker-color": "#000",
        "marker-size": "small",
        "marker-symbol": "shop",
        "title": f.properties.ArabicName,
        ...f.properties
    }
});

export default class PharmaciesAccessibleWithin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radius: 300,
            geojson: pharmacyGeoJson,
            layer: "pharmacy",
            result:[]
        }
    }


    updateMap(){

      var buffer = turf.buffer(this.route.getGeoJSON(), this.state.radius / 5280, 'miles');

      this.bufferLayer.setGeoJSON(buffer).setStyle({stroke: false, fillColor: 'hotpink', fillOpacity: 0.2}).eachLayer(function(layer) {
          layer.bindLabel('Bay to Breakers Route', {noHide: true});
      });

      let bb = {
          "type": "FeatureCollection",
          "features": []
      }
      bb.features.push(buffer)

      var pharmaciesInside = turf.within(this.state.geojson, bb);

      pharmaciesInside.features.forEach(function(feature) {
          feature.properties['marker-color'] = '#00f';
          feature.properties['marker-symbol'] = 'pharmacy';
          feature.properties['marker-size'] = 'large';
      });

      this.setState({
        result: pharmaciesInside.features
      })
      this.pharmacyLayerInside.setGeoJSON(pharmaciesInside).eachLayer(function(layer) {
          //layer.bindLabel('Accessible pharmacy');
      });
    }

    onChange(value) {
        this.setState({radius: value});
        this.updateMap()

    }

    handleChange(e){
      let layer = e.target.value;
      this.setState({geojson: geojsons[layer], layer});
      this.pharmacyLayer.setGeoJSON(geojsons[layer]);

      this.updateMap()
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
        ], 14);
        window.mapview = this.mapview;

        layers.Dark.addTo(this.mapview);
        L.control.layers(layers).addTo(this.mapview);

        this.pharmacyLayer = L.mapbox.featureLayer().addTo(this.mapview);
        this.route = L.mapbox.featureLayer().addTo(this.mapview);
        this.bufferLayer = L.mapbox.featureLayer().addTo(this.mapview);
        this.pharmacyLayerInside = L.mapbox.featureLayer().addTo(this.mapview);

        this.pharmacyLayer.setGeoJSON(this.state.geojson);

        this.route.setGeoJSON(routeGeoJson);
        this.route.setStyle({color: 'hotpink', weight: 3});
        this.mapview.fitBounds(this.route.getBounds());

        this.updateMap();

        this.pharmacyLayer.on('click', (e) => {
            this.setState({selectedFeature: e.layer.feature, selectedMarker: e.layer, tapActiveKey: "2"})
        });

    }



    render() {
        return (
            <div>
                <Row>
                    <Col span={6}>
                        <Slider min={1} max={3000} onChange={(value) => this.onChange(value)} value={this.state.radius}/>
                    </Col>
                    <Col span={4}>
                        <InputNumber min={1} max={20} style={{
                            marginLeft: 16
                        }} value={this.state.radius} onChange={(value) => this.onChange(value)}/>
                    </Col>

                    <Col span={6}>
                       {/* <RadioGroup defaultValue="pharmacy" value={this.state.layer} size="large" onChange={(value)=>this.handleChange(value)}>
                          <RadioButton value="pharmacy">pharmacy</RadioButton>
                          <RadioButton value="civil defense">civil defense</RadioButton>
                        </RadioGroup> */}
                     </Col>

                </Row>
                <Row gutter={16}>
                  <Col span={16}>
                    <div id="map-canvas" className="map-canvas"></div>
                  </Col>
                  <Col span={8}>
                    <Table columns={columns} dataSource={this.state.result} />

                  </Col>
                </Row>
                <Row>
                </Row>
            </div>
        );
    }
}

PharmaciesAccessibleWithin.propTypes = {};
