<template>
  <div>
    <div class="col-lg-12">
      <input type="button" @click="getLayers()" value="Click me"></input>
      <div id="mapid"></div>
      {{regionLayers}}
    </div>

    <div class="col-lg-12 d-flex d-lg-block">
      <form>
        <div class="form-group form-inline">
          <label for="selRegion"><h3>{{$t('region')}}:</h3></label>
          <select v-model="region" class="custom-select" id="selRegion">
            <option v-bind:value="item.code" v-for="(item, key, index) in regions">{{item.value}}</option>
          </select>
        </div>

        <div class="form-group form-inline">
          <div class="checkbox">
            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="scale" v-model="logScale">
              <label class="custom-control-label" for="scale">{{$t('logScale')}}</label>
            </div>
          </div>
        </div>
      </form>
    </div>


    <div class="col-lg-12 col-sm-12 d-lg-block">
      <div class="row">
        <div class="col-sm-12 col-lg-6 d-flex d-lg-block">
          <time-chart key='chart1' v-if="loaded" :chartData="deaths" :height="height"
            :title="$t('deathsCumTitle')" :ylabel="$t('deathsCumLabel')" :scale="scale"/>
        </div>
        <div class="col-sm-12 col-lg-6 d-flex d-lg-block">
          <time-chart key='chart3' v-if="loaded" :chartData="cases" :height="height"
            :title="$t('casesCumTitle')" :ylabel="$t('casesCumLabel')" :scale="scale"/>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-lg-4 d-flex d-lg-block">
          <time-chart key='chart2' v-if="loaded" :chartData="altas" :height="height"
            :title="$t('altasTitle')" :ylabel="$t('altasLabel')" :scale="scale"/>
        </div>
        <div class="col-sm-12 col-lg-4 d-flex d-lg-block">
          <time-chart key='chart4' v-if="loaded" :chartData="uci" :height="height"
            :title="$t('icuTitle')" :ylabel="$t('icuLabel')" :scale="scale"/>
        </div>
        <div class="col-sm-12 col-lg-4 d-flex d-lg-block">
          <time-chart key='chart5' v-if="loaded" :chartData="hospital" :height="height"
            :title="$t('hospitalTitle')" :ylabel="$t('hospitalLabel')" :scale="scale"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TimeChart from "./TimeChart.vue"
import _ from "lodash"
import i18n from '../plugins/i18n'

export default {
  components: {
    TimeChart,
  },
  data () {
    return {
      map : '',
      logScale : true,
      loaded : true,
      region : '13',
      regions : [],
      threshold : 2,
      height : 400,
      latest : {},
      colors : {},
      regionLayers : {},
      previousLayerClicked : null,
      initialZoomMap : 6,
      //https://gka.github.io/palettes/#/50|s|add8e6,00005b|ffffe0,ff005e,93003a|1|1
      colorScale : ['#add8e6', '#aad3e3', '#a7cee0', '#a4c9dd', '#a1c5da', '#9ec0d7', '#9bbbd4', '#98b6d1', '#95b2cf', '#92adcc', '#8fa8c9', '#8ca3c6', '#899fc3', '#869ac0', '#8396bd', '#8091ba', '#7d8cb7', '#7a88b5', '#7783b2', '#747faf', '#717aac', '#6e76a9', '#6b71a6', '#686da3', '#6569a1', '#62649e', '#5e609b', '#5b5c98', '#585795', '#555392', '#524f90', '#4f4b8d', '#4b478a', '#484287', '#453e84', '#413a82', '#3e367f', '#3a327c', '#372e79', '#332a76', '#302674', '#2c2271', '#281d6e', '#24196b', '#1f1569', '#1b1166', '#150c63', '#0f0860', '#08045e', '#00005b'],
      //https://gka.github.io/palettes/#/50|s|6aeb6a,001400|ffffe0,ff005e,93003a|1|1
      colorScaleSelected : ['#6aeb6a', '#68e668', '#65e166', '#63dc63', '#61d761', '#5fd25f', '#5ccd5d', '#5ac85a', '#58c358', '#56be56', '#54b954', '#51b552', '#4fb050', '#4dab4d', '#4ba64b', '#49a149', '#479d47', '#449845', '#429343', '#408f41', '#3e8a3f', '#3c863d', '#3a813b', '#387d39', '#367837', '#347435', '#326f33', '#306b31', '#2e662f', '#2c622d', '#2a5e2b', '#285929', '#265527', '#245125', '#224d23', '#204921', '#1e451f', '#1c411d', '#1a3d1b', '#18391a', '#173518', '#153116', '#132d14', '#112912', '#102510', '#0e220e', '#0c1e0b', '#081b07', '#041804', '#001400'],
      deaths: {
        labels: [],
        datasets: [],
      },
      cases: {
        labels: [],
        datasets: [],
      },
      altas: {
        labels: [],
        datasets: [],
      },
      uci: {
        labels: [],
        datasets: [],
      },
      hospital: {
        labels: [],
        datasets: [],
      },
    }
  },
  beforeMount() {
    this.fetchRegions()
    this.fetchDataRegions('fallecidos', this.region, 'deaths')
    this.fetchDataRegions('casos', this.region, 'cases')
    this.fetchDataRegions('altas', this.region, 'altas')
    this.fetchDataRegions('uci', this.region, 'uci')
    this.fetchDataRegions('hospitalizados', this.region, 'hospital')
  },
  mounted() {
    if (window.innerWidth < 800){
      this.initialZoomMap = 5
    }
    this.createMap()
  },
  computed: {
    scale: function () {
      return this.logScale ? 'logarithmic' : 'linear'
    },
    locale : function (){
      return i18n.locale
    }
  },
  watch: {
    region: _.debounce(
      function (newvalue, oldvalue) {
        this.updateMapSelection()
        this.loadData()
      },
      500),
    scale: function (newvalue, oldvalue) {
      this.loadData()
      },
    locale: function (newvalue, oldvalue) {
      this.fetchRegions()
      this.loadData()
    },
  },
  methods : {
    loadData : function(){
      this.fetchDataRegions('fallecidos'    , this.region, 'deaths')
      this.fetchDataRegions('casos'         , this.region, 'cases')
      this.fetchDataRegions('altas'         , this.region, 'altas')
      this.fetchDataRegions('uci'           , this.region, 'uci')
      this.fetchDataRegions('hospitalizados', this.region, 'hospital')
    },
    updateMapSelection : function(){
      var selectedLayer = {}
      var region = this.region
      this.map.eachLayer(function(layer) {
        if (layer.code && (layer.code == region)){
          selectedLayer = layer
        }
      })
      if (this.previousLayerClicked !== null) {
        // Reset style
        var colorOld = this.colorScale[region]
        this.previousLayerClicked.setStyle({
          weight: 1,
          color: 'gray',
          fillColor : colorOld,
          dashArray: null,
        });
      }

      var color = this.colorScaleSelected[region]
      selectedLayer.setStyle({
          weight: 1,
          color: 'green',
          fillColor: color,
          dashArray: '',
      });
      this.previousLayerClicked = selectedLayer
    },

    onRegionSelect: function (object, region) {
      var f = function (e){
          object.region = region

          if (object.previousLayerClicked !== null) {
            // Reset style
            var colorOld = object.colorScale[region]
            object.previousLayerClicked.setStyle({
              weight: 1,
              color: 'gray',
              fillColor : colorOld,
              dashArray: null,
            });
          }

          var layer = e.target
          var color = object.colorScaleSelected[region]
          layer.setStyle({
              weight: 1,
              color: 'green',
              fillColor: color,
              dashArray: '',
          });
          object.previousLayerClicked = layer
      }
      return f
    },

    setStyle: function(feature) {
      var color = this.colors[feature.properties.code]
      return {
        fillColor: color,
        color: 'gray',
        fillOpacity: 1,
        weight: 1,
        opacity: 1,
      };
    },
    onEachFeature:function (feature, layer) {
        layer.on({
          click : this.onRegionSelect(this, feature.properties.code)
        })
        layer.code = feature.properties.code
        // console.log(layer)
	  },
    computeColors : function(data) {
      var values    = _.values(this.latest)
      var maxValue = Math.max(...values)

      const functionForEach = function(value, colors) {
        return colors[Math.floor(value/maxValue * 50 - 1)]
      }
      this.colors = _.mapValues(data, _.ary(_.partialRight(functionForEach, this.colorScale), 1));
    },
    createMap: function(){
      this.map = L.map('mapid').setView([39.803747, -3.7038], this.initialZoomMap);
      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );

      this.tileLayer.addTo(this.map);

      const baseURI = 'https://raw.githubusercontent.com/jmbenlloch/covid19-web/master/dist/spain-comunidad-with-canary-islands.geojson'
      this.$http.get(baseURI)
      .then((result) =>{
        var geojson = result.data

        const baseURI = 'https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/comunidades/casosLatest'
        this.$http.get(baseURI)
        .then((result) =>{
          var dataArray = result.data.fields.values.arrayValue.values

          const arrayToObject = (array) =>
           array.reduce((obj, item) => {
             obj[item.mapValue.fields.ine_code.stringValue] = parseInt(item.mapValue.fields.total.stringValue)
             return obj
           }, {})

           this.latest = arrayToObject(dataArray)
           this.computeColors(this.latest)

          L.geoJSON(geojson, {
              style: this.setStyle,
              onEachFeature: this.onEachFeature
            }).addTo(this.map);
          })

          console.log(this.map)
          this.map.eachLayer(function(layer) {
            // console.log(layer.options)
            // if(layer.options && layer.options.pane == "overlayPane") {
            //   console.log(layer.code);
            // }
                layer.bindPopup('Hello');
          });


      })
    },
    getLayers : function(){
      var layers = [];
      this.map.eachLayer(function(layer) {
          // if( layer instanceof L.TileLayer )
              layers.push(layer);
      });
      console.log(layers)
    },
    fetchRegions: function () {
      const baseURI = 'https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/comunidades/list'
      this.$http.get(baseURI)
      .then((result) => {
        var regions = _.toPairs(result.data.fields)
        regions = _.map(regions, function(array) {
            return {
              ['code'] : array[0],
              ['value']: array[1].stringValue}
          })
        regions = _.sortBy(regions, 'value')
        this.regions = regions
      })
    },
    extractIntProperty: function (array, property){
      var data_tmp = _.map(array, property)
      var data     = _.map(data_tmp, _.ary(parseInt, 1))
      return data
    },
    fetchDataRegions: function (datatype, region, dataset){
      const baseURI = `https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/comunidades/${datatype}/${region}/data`
      this.$http.get(baseURI)
      .then((result) => {
        this.loaded = false
        var data_tmp = result.data.fields.values.arrayValue.values
        var dates = _.map(data_tmp, 'mapValue.fields.date.stringValue')
        var data  = this.extractIntProperty(data_tmp, 'mapValue.fields.counts.stringValue')

        this[dataset] = {
          labels: dates,
           datasets: [
             {
               label: '',
               borderColor: '#249EBF',
               backgroundColor : 'rgba(36, 158, 191, 0.3)',
               pointBackgroundColor: 'rgba(0,0,0,0)',
               pointBorderColor: 'rgba(0,0,0,0)',
               pointHoverBorderColor: '#249EBF',
               pointHoverBackgroundColor: '#fff',
               pointHoverRadius: 4,
               pointHitRadius: 10,
               pointHoverBorderWidth: 1,
               borderWidth: 1,
               data: data,
             }
           ]
         }
        this.loaded = true
      })
    },
  }
}
</script>

<style>
  #mapid { height: 500px; }
</style>
