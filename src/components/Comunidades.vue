<template>
  <div>
    <input type="button" value="Click Me" @click="createMap()">
    <div id="mapid"></div>

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
  mount() {
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
      this.fetchDataRegions('fallecidos', this.region, 'deaths')
      this.fetchDataRegions('casos', this.region, 'cases')
      this.fetchDataRegions('altas', this.region, 'altas')
      this.fetchDataRegions('uci', this.region, 'uci')
      this.fetchDataRegions('hospitalizados', this.region, 'hospital')
      },
      500),
    scale: function (newvalue, oldvalue) {
      this.fetchDataRegions('fallecidos', this.region, 'deaths')
      this.fetchDataRegions('casos', this.region, 'cases')
      this.fetchDataRegions('altas', this.region, 'altas')
      this.fetchDataRegions('uci', this.region, 'uci')
      this.fetchDataRegions('hospitalizados', this.region, 'hospital')
      },
    locale: function (newvalue, oldvalue) {
      this.fetchRegions()
      this.fetchDataRegions('fallecidos', this.region, 'deaths')
      this.fetchDataRegions('casos', this.region, 'cases')
      this.fetchDataRegions('altas', this.region, 'altas')
      this.fetchDataRegions('uci', this.region, 'uci')
      this.fetchDataRegions('hospitalizados', this.region, 'hospital')
    },
  },
  methods : {
    createMap: function(){
      //var mymap = L.map('mapid').setView([51.505, -0.09], 13);
      this.map = L.map('mapid').setView([40.4168, -3.7038], 6);
      this.tileLayer = L.tileLayer(
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
        }
      );

      this.tileLayer.addTo(this.map);

      var myLines = {
          "type": "LineString",
          "coordinates": [[40.4168, -3.7], [40, -2], [39, -2]]
      };


      var myStyle = {
          "color": "#ff7800",
          "weight": 5,
          "opacity": 0.65
      };

      var myLayer = L.geoJSON().addTo(this.map);
      myLayer.addData(myLines,{
        style: myStyle
      });

      // const baseURI = 'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/spain/spain-comunidad-with-canary-islands.json'
      const baseURI = 'http://localhost:8080/dist/spain-comunidad-with-canary-islands.geojson'
      //const baseURI = 'https://raw.githubusercontent.com/ackuser/leaflet-spain-geojson/master/spain-provinces.geojson'
      this.$http.get(baseURI)
      .then((result) =>{
        console.log(result)
        var geojson = result.data

        var myLayer = L.geoJSON().addTo(this.map);
        myLayer.addData([geojson]);
      })
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
