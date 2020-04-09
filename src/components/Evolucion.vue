<template>
  <div>
    <div class="col-lg-12">
      <div id="mapid"></div>
    </div>

    <div class="col-lg-12 d-flex d-lg-block">
      <form>
        <div class="form-group form-inline">
          <label for="selCountry"><h3>{{$t('country')}}:</h3></label>
          <select v-model="country" class="custom-select" id="selCountry">
            <option v-bind:value="item.code" v-for="(item, key, index) in countries">{{item.value}}</option>
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
            :title="$t('deathsTitle')" :ylabel="$t('deathsLabel')" :scale="scale"/>
        </div>
        <div class="col-sm-12 col-lg-6 d-flex d-lg-block">
          <time-chart key='chart3' v-if="loaded" :chartData="deathsCum" :height="height"
            :title="$t('deathsCumTitle')" :ylabel="$t('deathsCumLabel')" :scale="scale"/>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-lg-6 d-flex d-lg-block">
          <time-chart key='chart2' v-if="loaded" :chartData="cases" :height="height"
            :title="$t('casesTitle')" :ylabel="$t('casesLabel')" :scale="scale"/>
        </div>
        <div class="col-sm-12 col-lg-6 d-flex d-lg-block">
          <time-chart key='chart4' v-if="loaded" :chartData="casesCum" :height="height"
            :title="$t('casesCumTitle')" :ylabel="$t('casesCumLabel')" :scale="scale"/>
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
      //map
      latest : {},
      colors : {},
      countryLayers : {},
      previousLayerClicked : null,
      initialZoomMap : 2,
      //https://gka.github.io/palettes/#/50|s|add8e6,00005b|ffffe0,ff005e,93003a|1|1
      colorScale : ['#add8e6', '#aad3e3', '#a7cee0', '#a4c9dd', '#a1c5da', '#9ec0d7', '#9bbbd4', '#98b6d1', '#95b2cf', '#92adcc', '#8fa8c9', '#8ca3c6', '#899fc3', '#869ac0', '#8396bd', '#8091ba', '#7d8cb7', '#7a88b5', '#7783b2', '#747faf', '#717aac', '#6e76a9', '#6b71a6', '#686da3', '#6569a1', '#62649e', '#5e609b', '#5b5c98', '#585795', '#555392', '#524f90', '#4f4b8d', '#4b478a', '#484287', '#453e84', '#413a82', '#3e367f', '#3a327c', '#372e79', '#332a76', '#302674', '#2c2271', '#281d6e', '#24196b', '#1f1569', '#1b1166', '#150c63', '#0f0860', '#08045e', '#00005b'],
      //https://gka.github.io/palettes/#/50|s|6aeb6a,001400|ffffe0,ff005e,93003a|1|1
      colorScaleSelected : ['#6aeb6a', '#68e668', '#65e166', '#63dc63', '#61d761', '#5fd25f', '#5ccd5d', '#5ac85a', '#58c358', '#56be56', '#54b954', '#51b552', '#4fb050', '#4dab4d', '#4ba64b', '#49a149', '#479d47', '#449845', '#429343', '#408f41', '#3e8a3f', '#3c863d', '#3a813b', '#387d39', '#367837', '#347435', '#326f33', '#306b31', '#2e662f', '#2c622d', '#2a5e2b', '#285929', '#265527', '#245125', '#224d23', '#204921', '#1e451f', '#1c411d', '#1a3d1b', '#18391a', '#173518', '#153116', '#132d14', '#112912', '#102510', '#0e220e', '#0c1e0b', '#081b07', '#041804', '#001400'],

      logScale : true,
      loaded : true,
      country : 'ES',
      countries : [],
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
      deathsCum: {
        labels: [],
        datasets: [],
      },
      casesCum: {
        labels: [],
        datasets: [],
      },
    }
  },
  beforeMount() {
    this.fetchCountries()
    this.fetchData()
  },
  mounted() {
    if (window.innerWidth < 900){
      this.initialZoomMap = 1
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
    country: _.debounce(
      function (newvalue, oldvalue) {
        this.fetchData()
      },
      500),
    scale: function (newvalue, oldvalue) {
        this.fetchData()
      },
    locale: function (newvalue, oldvalue) {
      this.fetchCountries()
      this.fetchData()
    },
  },
  methods : {
    updateMapSelection : function(){
      var selectedLayer = {}
      var country = this.country
      this.map.eachLayer(function(layer) {
        if (layer.code && (layer.code == country)){
          selectedLayer = layer
        }
      })
      if (this.previousLayerClicked !== null) {
        // Reset style
        var colorOld = this.colorScale[country]
        this.previousLayerClicked.setStyle({
          weight: 1,
          color: 'gray',
          fillColor : colorOld,
          dashArray: null,
        });
      }

      var color = this.colorScaleSelected[country]
      selectedLayer.setStyle({
          weight: 1,
          color: 'green',
          fillColor: color,
          dashArray: '',
      });
      this.previousLayerClicked = selectedLayer
    },

    onRegionSelect: function (object, country) {
      var f = function (e){
          object.country = country

          if (object.previousLayerClicked !== null) {
            // Reset style
            var colorOld = object.colorScale[country]
            object.previousLayerClicked.setStyle({
              weight: 1,
              color: 'gray',
              fillColor : colorOld,
              dashArray: null,
            });
          }

          var layer = e.target
          var color = object.colorScaleSelected[country]
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
    },
    computeColors : function(data) {
      var values    = _.values(this.latest)
      var maxValue = Math.max(...values)

      const functionForEach = function(value, colors) {
        return colors[Math.floor(Math.sqrt(value)/Math.sqrt(maxValue) * 50 - 1)]
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

      const baseURI = 'https://raw.githubusercontent.com/jmbenlloch/covid19-web/master/dist/world-countries.geojson'
      this.$http.get(baseURI)
      .then((result) =>{
        var geojson = result.data

        const baseURI = 'https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/countries/casosLatest'
        this.$http.get(baseURI)
        .then((result) =>{
          var dataArray = result.data.fields.values.arrayValue.values

          const arrayToObject = (array) =>
           array.reduce((obj, item) => {
             obj[item.mapValue.fields.code.stringValue] = parseInt(item.mapValue.fields.total.stringValue)
             return obj
           }, {})

           this.latest = arrayToObject(dataArray)
           this.computeColors(this.latest)

          L.geoJSON(geojson, {
              style: this.setStyle,
              onEachFeature: this.onEachFeature
            }).addTo(this.map);
          })
      })
    },
    fetchCountries: function () {
      const baseURI = 'https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/countries/list_'
      this.$http.get(baseURI + i18n.locale)
      .then((result) => {
        var countries = _.toPairs(result.data.fields)
        countries = _.map(countries, function(array) {
            return {
              ['code'] : array[0],
              ['value']: array[1].stringValue}
          })
        countries = _.sortBy(countries, 'value')
        this.countries = countries
      })
    },
    extractIntProperty: function (array, property){
      var data_tmp = _.map(array, property)
      var data     = _.map(data_tmp, _.ary(parseInt, 1))
      return data
    },
    cumulativeSum : function (array){
      return _.reduce(array, function (acc, n) {
         acc.push( (acc.length > 0 ? acc[acc.length-1] : 0) + n); return acc
       }, [])
    },
    applyThreshold : function (item) {
      return item > this.threshold
    },
    fetchData: function () {
      const baseURI = 'https://firestore.googleapis.com/v1/projects/covid19-simulator/databases/(default)/documents/countries/'
      this.$http.get(baseURI + this.country)
      .then((result) => {
        var data_tmp = result.data.fields.data.arrayValue.values
        this.loaded = false

        var deaths = this.extractIntProperty(data_tmp, 'mapValue.fields.deaths.stringValue')
        var cases  = this.extractIntProperty(data_tmp, 'mapValue.fields.cases.stringValue')

        deaths = _.reverse(deaths)
        cases = _.reverse(cases)

        var deathsCum = this.cumulativeSum(deaths)
        var casesCum  = this.cumulativeSum(cases)

        var dates = _.map(data_tmp, 'mapValue.fields.dateRep.stringValue')
        dates = _.reverse(dates)

        //Apply threshold
        var idx = _.findIndex(cases, this.applyThreshold)
        dates     = dates.slice(idx)
        cases     = cases.slice(idx)
        deaths    = deaths.slice(idx)
        casesCum  = casesCum.slice(idx)
        deathsCum = deathsCum.slice(idx)

        this.deaths = {
          labels: dates,
           datasets: [
             {
               label: 'Muertes',
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
               data: deaths,
             }
           ]
         }

         this.cases = {
           labels: dates,
            datasets: [
              {
                label: 'Casos',
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
                data: cases,
              }
            ]
          }

          this.deathsCum = {
            labels: dates,
             datasets: [
               {
                 label: 'Muertes',
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
                 data: deathsCum,
               }
             ]
           }

           this.casesCum = {
             labels: dates,
              datasets: [
                {
                  label: 'Casos',
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
                  data: casesCum,
                }
              ]
            }
        this.loaded = true
      })
    }
  }
}
</script>


<style>
  #mapid { height: 500px; }
</style>
